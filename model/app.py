from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import sys
import os
sys.path.insert(0, os.path.abspath('.'))
from src.pipelines.predict_pipeline import PredictionPipeline
from src.components.data_transformation import DataTransformation
from src.logger import logging
from src.utils import load_yaml, ensure_parent_dir, load_object, calculate_regression_metrics
from src.decorators import handle_exception

app = Flask(__name__)
config = load_yaml('config/config.yaml')
# Initialize the pipeline once when the server starts
try:
    pipeline = PredictionPipeline()
    logging.info("Prediction Pipeline initialized successfully.")
except Exception as e:
    logging.error(f"Failed to initialize Prediction Pipeline: {e}")
    pipeline = None


@app.route('/predict', methods=['POST', 'GET'])
@handle_exception
def predict_route():
    if request.method=='GET':
        return "Hi, you are ready for prediction, use post request."
    if pipeline is None:
        return jsonify({"error": "Pipeline not initialized"}), 500

    # Get JSON data from request
    data = request.get_json()
    logging.info(f"Raw request data: {data}")
    
    # Expected format: {"samples": [{"meal_id": 123, "center_id": 55, ...}, {...}]}
    if not data or 'samples' not in data:
        return jsonify({"error": "Invalid input. 'samples' list is required."}), 400

    # Convert list of dicts to DataFrame
    input_df = pd.DataFrame(data['samples'])
    logging.info(f"Initial DataFrame dtypes: {input_df.dtypes.to_dict()}")

    if input_df.empty:
        return jsonify({"error": "No prediction samples provided."}), 400

    required_columns = [
        'center_id', 'meal_id', 'week',
        'checkout_price', 'base_price',
        'emailer_for_promotion', 'homepage_featured'
    ]
    missing_columns = [col for col in required_columns if col not in input_df.columns]
    if missing_columns:
        return jsonify({
            "error": "Missing required columns for prediction.",
            "missing_columns": missing_columns
        }), 400

    # Force numeric/bool columns to proper dtypes, since JSON input may arrive as strings
    for col in required_columns:
        input_df[col] = pd.to_numeric(input_df[col], errors='coerce')

    invalid_numeric = [
        col for col in required_columns
        if input_df[col].isna().any()
    ]
    if invalid_numeric:
        logging.error(f"Non-numeric values found in: {invalid_numeric}. Sample values: {[(col, input_df[col].dropna().head(3).tolist()) for col in invalid_numeric]}")
        return jsonify({
            "error": "Invalid input values for numeric/bool fields.",
            "invalid_columns": invalid_numeric
        }), 400

    input_df = input_df.astype({
        'center_id': 'int64',
        'meal_id': 'int64',
        'week': 'int64',
        'checkout_price': 'float64',
        'base_price': 'float64',
        'emailer_for_promotion': 'int64',
        'homepage_featured': 'int64'
    })
    # logging.info(f"Final prediction input dtypes: {input_df.dtypes.to_dict()}")
    # logging.info(f"Sample row from input: {input_df.iloc[0].to_dict() if len(input_df) > 0 else 'empty'}")

    # Keep track of meal_ids to map them back to results
    meal_ids = input_df['meal_id'].tolist()
    # logging.info(f"Prediction dataset shape:{input_df.shape}")

    # Run prediction
    predictions = pipeline.predict(input_df)

    # Structure the response
    results = []
    for meal_id, pred in zip(meal_ids, predictions):
        results.append({
            "meal_id": int(meal_id),
            "predicted_orders": float(round(pred, 2))
        })
    # print("Results",list(results))

    return jsonify({"status": "success", "predictions": results})

@app.route('/ingest_data', methods=["POST", "GET"])
@handle_exception
def ingest_data():

    if request.method == "GET":
        return "Hello, the api is working for ingesting data."

    payload = request.get_json(force=True)
    features, data = payload.get("features"), payload.get("data")

    # Basic validation
    if not isinstance(features, list) or not isinstance(data, list):
        return jsonify({"error": "Invalid or missing 'features'/'data'"}), 400

    if any(len(row) != len(features) for row in data):
        return jsonify({"error": "Row length mismatch"}), 400

    # Convert
    new_df = pd.DataFrame(np.array(data, dtype=np.float32), columns=features)

    file_path = config['artifacts']['new_ingested_data']
    ensure_parent_dir(file_path)

    # Header check (if file exists)
    if os.path.exists(file_path):
        existing_cols = pd.read_csv(file_path, nrows=0).columns.tolist()
        if existing_cols != features:
            return jsonify({
                "error": "Feature mismatch",
                "expected": existing_cols,
                "received": features
            }), 400

    # Append
    new_df.to_csv(file_path, mode='a', header=not os.path.exists(file_path), index=False)

    return jsonify({
        "message": "Data ingested",
        "rows": len(new_df)
    }), 200


@app.route('/get-metrics', methods=['GET'])
@handle_exception
def get_metrics():
    """
    Returns model performance metrics (R2, MAE, RMSLE, WMAPE) calculated on test data.
    """
    try:
        config = load_yaml('config/config.yaml')
        artifacts_cfg = config["artifacts"]
        
        # Load test data
        test_path = os.path.join(artifacts_cfg["artifacts_dir"], "data", "test.csv")
        if not os.path.exists(test_path):
            return jsonify({"error": f"Test data not found at {test_path}"}), 404
        
        test_df = pd.read_csv(test_path)
        logging.info(f"Loaded test data with shape {test_df.shape}")
        
        transformer = DataTransformation()
        test_df = transformer.create_time_series_features(test_df).dropna()

        X_test = test_df.drop(columns=['num_orders'])
        y_test = np.log1p(test_df['num_orders'].values)
        
        # Load trained model
        model_path = os.path.join(artifacts_cfg["model_dir"], artifacts_cfg["model_name"])
        if not os.path.exists(model_path):
            return jsonify({"error": f"Model not found at {model_path}"}), 404
        
        model = load_object(model_path)
        logging.info("Model loaded successfully")
        
        # Make predictions
        predictions = model.predict(X_test)
        
        # Calculate metrics
        metrics = calculate_regression_metrics(y_test, predictions, is_log_transformed=True)
        
        logging.info(f"Calculated metrics: {metrics}")
        
        return jsonify({
            "status": "success",
            "metrics": metrics
        }), 200
        
    except Exception as e:
        logging.error(f"Error in get_metrics: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/get-baseline-sales/<int:center_id>', methods=['GET'])
@handle_exception
def get_baseline_sales(center_id):
    """
    Returns historical average sales (baseline) for a given center_id across all weeks.
    Used to calculate baseline profit for comparison with model predictions.
    Returns: [{"week": 1, "meal_id": 123, "avg_orders": 150}, ...]
    """
    try:
        config = load_yaml('config/config.yaml')
        artifacts_cfg = config["artifacts"]
        
        # Load training data (contains historical sales)
        train_path = os.path.join(artifacts_cfg["artifacts_dir"], "data", "train.csv")
        if not os.path.exists(train_path):
            return jsonify({"error": f"Training data not found at {train_path}"}), 404
        
        train_df = pd.read_csv(train_path)
        logging.info(f"Loaded training data with shape {train_df.shape}")
        
        # Filter by center_id
        center_data = train_df[train_df['center_id'] == center_id]
        
        if center_data.empty:
            logging.warning(f"No historical data found for center_id {center_id}")
            return jsonify({
                "status": "success",
                "center_id": center_id,
                "baseline_sales": []
            }), 200
        
        logging.info(f"Found {len(center_data)} records for center_id {center_id}")
        
        meal_average_orders = center_data.groupby('meal_id')['num_orders'].mean().to_dict()
        baseline = center_data.sort_values(['week', 'meal_id']).groupby(['week', 'meal_id']).mean().reset_index()
        
        # Convert to list of dicts for JSON response
        baseline_list = []
        for _, row in baseline.iterrows():
            baseline_list.append({
                "week": int(row['week']),
                "meal_id": int(row['meal_id']),
                "avg_orders": float(round(meal_average_orders.get(row['meal_id'], 0.0), 2)),
                "checkout_price": float(row['checkout_price']),
                "base_price": float(row['base_price']),
                "emailer_for_promotion": int(row['emailer_for_promotion']),
                "homepage_featured": int(row['homepage_featured'])
            })
        
        logging.info(f"Calculated baseline for {len(baseline_list)} week-meal combinations")
        
        return jsonify({
            "status": "success",
            "center_id": center_id,
            "baseline_sales": baseline_list
        }), 200
        
    except Exception as e:
        logging.error(f"Error in get_baseline_sales: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    # In production, use a WSGI server like Gunicorn
    app.run(host="0.0.0.0", port=5001, debug=True)
