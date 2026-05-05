import os
import pandas as pd
from typing import Tuple, Dict
from clg.Meals_prediction_model.src.decorators import handle_exception
from clg.Meals_prediction_model.src.logger import logging
from clg.Meals_prediction_model.src.utils import load_yaml, save_object, ensure_parent_dir
from clg.Meals_prediction_model.src.exception import CustomException
class DataIngestion:
    def __init__(self, config_path: str = "config/config.yaml"):
        self.config = load_yaml(config_path)
        self.artifacts_cfg = self.config["artifacts"]
        self.data_cfg = self.config["data"]

    @handle_exception
    def initiate_data_ingestion(self) -> Dict[str, str]:
        """
        Reads the raw sales data and splits it into train and test sets
        based on the week threshold defined in config.
        """
        logging.info("Starting data ingestion process.")

        # 1. Load Raw Data
        raw_data_path = self.data_cfg["raw_data_path"]
        df = pd.read_csv(raw_data_path)
        logging.info(f"Raw data loaded successfully from {raw_data_path}. Shape: {df.shape}")

        logging.info("Checking if new data exist...")
        new_data_path = self.artifacts_cfg['new_ingested_data']
        if os.path.exists(new_data_path):
            logging.info("Exist")
            df_new = pd.read_csv(new_data_path)
            if list(df.columns) != list(df_new.columns):
                logging.info("header mismatch...")
                raise ValueError("Header Mismatch..")
            df = pd.concat([df,df_new], ignore_index=True)
            logging.info("Data Concatenated..")
        else:
            logging.info("Doesn't Exist")
        
        latest_data_artifact_path = self.artifacts_cfg["latest_data"]
        ensure_parent_dir(latest_data_artifact_path)
        df.to_csv(latest_data_artifact_path, index=False)
        logging.info(f"Latest reference data saved at: {latest_data_artifact_path}")

        # 2. Split Data (Time-based split as per Colab: Week 130)
        split_week = self.data_cfg["split_week"]
        
        train_df = df[df['week'] < split_week]
        test_df = df[df['week'] >= split_week]

        logging.info(f"Data split at week {split_week}. Train rows: {len(train_df)}, Test rows: {len(test_df)}")

        # 3. Create Artifacts Directory if it doesn't exist
        os.makedirs(self.artifacts_cfg["artifacts_dir"], exist_ok=True)

        # 4. Save to CSV
        train_path = self.artifacts_cfg["train_data_path"]
        test_path = self.artifacts_cfg["test_data_path"]

        train_df.to_csv(train_path, index=False)
        test_df.to_csv(test_path, index=False)

        logging.info(f"Ingested data saved to {train_path} and {test_path}")

        return {
            "train_data_path": train_path,
            "test_data_path": test_path
        }