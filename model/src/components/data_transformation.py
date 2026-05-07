import pandas as pd
import numpy as np
from typing import Dict, Tuple
from src.decorators import handle_exception
from src.logger import logging
from src.utils import load_yaml, save_object

class DataTransformation:
    def __init__(self, config_path: str = "config/config.yaml"):
        self.config = load_yaml(config_path)
        self.data_cfg = self.config["data"]
        self.artifacts_cfg = self.config["artifacts"]

    @staticmethod
    def create_time_series_features(df: pd.DataFrame) -> pd.DataFrame:
        """
        Implements the feature engineering logic from your Colab.
        """
        logging.info("Engineering lag and rolling mean features.")
        
        # Sort values to ensure lags are calculated correctly
        df = df.sort_values(['meal_id', 'center_id', 'week'])

        # Lag features
        df['lag_1'] = df.groupby(['meal_id', 'center_id'])['num_orders'].shift(1)
        df['lag_2'] = df.groupby(['meal_id', 'center_id'])['num_orders'].shift(2)
        df['lag_3'] = df.groupby(['meal_id', 'center_id'])['num_orders'].shift(3)
        df['lag_4'] = df.groupby(['meal_id', 'center_id'])['num_orders'].shift(4)

        # Rolling features
        df['rolling_mean_3'] = df.groupby(['meal_id', 'center_id'])['num_orders']\
                                .shift(1).rolling(3).mean()
        df['rolling_mean_5'] = df.groupby(['meal_id', 'center_id'])['num_orders']\
                                .shift(1).rolling(5).mean()

        # Trend features
        df['trend'] = df['lag_1'] - df['lag_2']
        df['growth'] = df['lag_1'] / (df['lag_2'] + 1)

        return df

    @handle_exception
    def initiate_data_transformation(self, train_path: str, test_path: str) -> Dict:
        logging.info("Starting data transformation.")

        # 1. Load data from ingestion paths
        train_df = pd.read_csv(train_path)
        test_df = pd.read_csv(test_path)

        # 2. Apply feature engineering
        train_df = self.create_time_series_features(train_df).dropna()
        test_df = self.create_time_series_features(test_df).dropna()

        # 3. Separate Features and Target
        target_column = self.data_cfg["target_column"]
        
        X_train = train_df.drop(columns=[target_column])
        y_train = train_df[target_column]
        
        X_test = test_df.drop(columns=[target_column])
        y_test = test_df[target_column]

        # 4. Log Transformation (as used in your Colab)
        # We use log1p to handle zeros safely
        logging.info("Applying log transformation to target variable.")
        y_train = np.log1p(y_train)
        y_test = np.log1p(y_test)

        # 5. Save the transformed data objects for the Trainer
        transformed_data = {
            "X_train": X_train,
            "y_train": y_train,
            "X_test": X_test,
            "y_test": y_test
        }
        
        transformed_path = self.artifacts_cfg["transformed_data_path"]
        save_object(transformed_path, transformed_data)
        logging.info(f"Transformed data saved at {transformed_path}")

        return transformed_data