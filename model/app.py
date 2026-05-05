from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from clg.Meals_prediction_model.src.pipelines.predict_pipeline import PredictionPipeline
from clg.Meals_prediction_model.src.logger import logging
from clg.Meals_prediction_model.src.utils import load_yaml, ensure_parent_dir
from clg.Meals_prediction_model.src.decorators import handle_exception
import os

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
    
    # Expected format: {"samples": [{"meal_id": 123, "center_id": 55, ...}, {...}]}
    if not data or 'samples' not in data:
        return jsonify({"error": "Invalid input. 'samples' list is required."}), 400

    # Convert list of dicts to DataFrame
    input_df = pd.DataFrame(data['samples'])
    
    # Keep track of meal_ids to map them back to results
    meal_ids = input_df['meal_id'].tolist()
    logging.info(f"Prediction dataset shape:{input_df.shape}")

    # Run prediction
    predictions = pipeline.predict(input_df)

    # Structure the response
    results = []
    for meal_id, pred in zip(meal_ids, predictions):
        results.append({
            "meal_id": int(meal_id),
            "predicted_orders": float(round(pred, 2))
        })

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

if __name__ == "__main__":
    # In production, use a WSGI server like Gunicorn
    app.run(host="0.0.0.0", port=5001, debug=True)