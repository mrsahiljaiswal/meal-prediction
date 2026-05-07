import os
import pandas as pd
import numpy as np
import dill
from typing import Dict, List, Any
from sklearn.metrics import r2_score
from lightgbm import LGBMRegressor
from xgboost import XGBRegressor
from catboost import CatBoostRegressor
from sklearn.model_selection import RandomizedSearchCV

from src.decorators import handle_exception
from src.logger import logging
from src.utils import load_yaml, save_object, calculate_regression_metrics



class ModelTrainer:
    def __init__(self, config_path: str = "config/config.yaml"):
        self.config = load_yaml(config_path)
        self.model_cfg = self.config["model"]
        self.artifacts_cfg = self.config["artifacts"]

    def get_model_instance(self, model_name: str):
        models = {
            "lightgbm": (LGBMRegressor(), self.config["param_grids"]["lgb"]),
            "xgboost": (XGBRegressor(), self.config["param_grids"]["xgb"]),
            "catboost": (CatBoostRegressor(verbose=0), self.config["param_grids"]["cat"])
        }
        return models.get(model_name.lower())

    @handle_exception
    def initiate_model_trainer(self, train_array: Dict) -> Dict:
        """
        Trains the model using RandomizedSearchCV as per Colab logic.
        """
        X_train, y_train = train_array["X_train"], train_array["y_train"]
        X_test, y_test = train_array["X_test"], train_array["y_test"]

        logging.info("Initializing models for training.")
        
        # In Colab you focused on LGBM with specific grids
        selected_name = self.config["model"]["selected_model"]
        model, param_grid = self.get_model_instance(model_name = selected_name)

        logging.info("Starting Randomized Search CV.")
        rs = RandomizedSearchCV(
            estimator=model,
            param_distributions=param_grid,
            n_iter=self.model_cfg.get("n_iter", 5),
            cv=3,
            scoring='neg_mean_absolute_error',
            verbose=1,
            random_state=42,
            n_jobs=-1
        )

        rs.fit(X_train, y_train)
        
        best_model = rs.best_estimator_
        logging.info(f"Best Model Found. Params: {rs.best_params_}")

        # Predictions for evaluation
        test_pred = best_model.predict(X_test)
        metrics = calculate_regression_metrics(y_test, test_pred, is_log_transformed=True)
        
        logging.info(f"Test Metrics: {metrics}")

        # Save the model using dill (as in your Colab)
        model_path = os.path.join(self.artifacts_cfg["model_dir"], self.artifacts_cfg["model_name"])
        os.makedirs(self.artifacts_cfg["model_dir"], exist_ok=True)
        
        with open(model_path, "wb") as f:
            dill.dump(best_model, f)
            
        logging.info(f"Model saved at {model_path}")

        return {
            "best_model": best_model,
            "metrics": metrics
        }