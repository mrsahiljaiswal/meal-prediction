# src/pipeline/prediction_pipeline.py
import os
import pandas as pd
import numpy as np
import dill
from clg.Meals_prediction_model.src.components.data_transformation import DataTransformation
from clg.Meals_prediction_model.src.utils import load_yaml, load_object
from clg.Meals_prediction_model.src.logger import logging

class PredictionPipeline:
    def __init__(self, config_path: str = "config/config.yaml"):
        self.config = load_yaml(config_path)
        self.artifacts_cfg = self.config["artifacts"]
        
        # Initialize Transformation component to reuse logic
        self.transformer = DataTransformation(config_path=config_path)
        
        # Load Paths
        self.model_path = os.path.join(self.artifacts_cfg["model_dir"], self.artifacts_cfg["model_name"])
        self.history_path = self.artifacts_cfg["latest_data"]

    def _load_model(self):
        return load_object(self.model_path)

    def predict(self, input_df: pd.DataFrame):
        """
        input_df: DataFrame containing the new week's details (center_id, meal_id, prices, etc.)
        """
        try:
            logging.info("Starting prediction pipeline.")

            # 1. Load historical context saved during Ingestion
            if not os.path.exists(self.history_path):
                raise FileNotFoundError(f"History file not found at {self.history_path}. Run Ingestion first.")
            history_df = pd.read_csv(self.history_path)

            # 2. Combine history with new input
            # We assume input_df does not have 'num_orders'
            combined_df = pd.concat([history_df, input_df], ignore_index=True)

            # 3. Transform using the shared component
            transformed_df = self.transformer.create_time_series_features(combined_df)

            # 4. Filter for the new rows (where num_orders is NaN)
            # We also ensure we only take the columns the model expects
            X_predict = transformed_df[transformed_df['num_orders'].isna()].copy()
            X_predict = X_predict.drop(columns=['num_orders'], errors='ignore')

            if X_predict.isna().sum().sum() > 0:
                logging.warning("Some features are NaN. This happens if history for this meal/center is too short.")

            # 5. Model Inference
            model = self._load_model()
            log_predictions = model.predict(X_predict)

            # 6. Inverse Log Transform
            final_predictions = np.expm1(log_predictions)
            
            logging.info("Prediction successful.")
            return final_predictions

        except Exception as e:
            logging.error(f"Prediction failed: {e}")
            raise e

