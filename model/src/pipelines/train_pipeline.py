import mlflow
import mlflow.sklearn
from src.components.data_ingestion import DataIngestion
from src.components.data_transformation import DataTransformation
from src.components.model_trainer import ModelTrainer
from src.logger import logging
from src.utils import load_yaml

class TrainPipeline:
    def __init__(self, config_path: str = "config/config.yaml"):
        self.config = load_yaml(config_path)
        self.config_path = config_path

    def run(self) -> dict:
        # 1. Initialize Components
        data_ingestion = DataIngestion(config_path=self.config_path)
        data_transformation = DataTransformation(config_path=self.config_path)
        model_trainer = ModelTrainer(config_path=self.config_path)

        # 2. Data Ingestion
        ingestion_out = data_ingestion.initiate_data_ingestion()
        
        # 3. Data Transformation (Feature Engineering + Log Transform)
        transformed_data = data_transformation.initiate_data_transformation(
            train_path=ingestion_out["train_data_path"],
            test_path=ingestion_out["test_data_path"]
        )

        # 4. MLflow Setup
        mlflow_cfg = self.config["mlflow"]
        if mlflow_cfg.get("tracking_uri"):
            mlflow.set_tracking_uri(mlflow_cfg["tracking_uri"])
        mlflow.set_experiment(mlflow_cfg["experiment_name"])

        with mlflow.start_run(run_name=mlflow_cfg.get('run_name', 'meal_demand_training')):
            # Log tags
            mlflow.set_tags(mlflow_cfg.get('tags', {}))

            # 5. Model Training (Model is selected inside Trainer based on config)
            model_out = model_trainer.initiate_model_trainer(train_array=transformed_data)
            
            # 6. Log Parameters and Metrics
            mlflow.log_params(self.config["model"])
            mlflow.log_metrics(model_out["metrics"])

            # 7. Log Model Artifact
            # Using mlflow.sklearn as it supports LGBM/XGB/CatBoost sklearn wrappers
            mlflow.sklearn.log_model(
                model_out["best_model"], 
                artifact_path="model",
                registered_model_name=self.config["model"]["selected_model"]
            )

            logging.info(f"Training complete. Metrics: {model_out['metrics']}")
            
            return model_out["metrics"]

if __name__ == "__main__":
    output = TrainPipeline().run()
    print(output)