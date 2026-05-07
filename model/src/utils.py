import os
from typing import Any

import dill
import yaml

import numpy as np
from sklearn.metrics import r2_score



def load_yaml(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as file:
        return yaml.safe_load(file)


def ensure_parent_dir(path: str) -> None:
    parent = os.path.dirname(path)
    if parent:
        os.makedirs(parent, exist_ok=True)


def save_object(path: str, obj: Any) -> None:
    ensure_parent_dir(path)
    with open(path, "wb") as file:
        dill.dump(obj, file)


def load_object(path: str) -> Any:
    with open(path, "rb") as file:
        return dill.load(file)

def calculate_regression_metrics(y_true, y_pred, is_log_transformed=True):
    """
    Calculates WMAPE, RMSLE, MAE, and R2.
    If the input data is log-transformed (log1p), it reverts it back 
    to the original scale for standard metric calculation.
    """
    if is_log_transformed:
        y_true = np.expm1(y_true)
        y_pred = np.expm1(y_pred)

    # Ensure no negative predictions for metrics that don't allow them
    y_pred = np.maximum(y_pred, 0)

    wmape = np.sum(np.abs(y_true - y_pred)) / np.sum(y_true)
    rmsle = np.sqrt(np.mean((np.log1p(y_pred) - np.log1p(y_true))**2))
    mae = np.mean(np.abs(y_true - y_pred))
    r2 = r2_score(y_true, y_pred)
    
    return {
        "wmape": float(wmape),
        "rmsle": float(rmsle),
        "mae": float(mae),
        "r2_score": float(r2)
    }
