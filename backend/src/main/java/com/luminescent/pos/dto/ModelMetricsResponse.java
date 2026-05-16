package com.luminescent.pos.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ModelMetricsResponse {
    private String status;
    private Metrics metrics;

    public ModelMetricsResponse() {
    }

    public ModelMetricsResponse(String status, Metrics metrics) {
        this.status = status;
        this.metrics = metrics;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Metrics getMetrics() {
        return metrics;
    }

    public void setMetrics(Metrics metrics) {
        this.metrics = metrics;
    }

    public static class Metrics {
        @JsonProperty("r2_score")
        private double r2Score;
        private double mae;
        private double rmsle;
        private double wmape;

        public Metrics() {
        }

        public Metrics(double r2Score, double mae, double rmsle, double wmape) {
            this.r2Score = r2Score;
            this.mae = mae;
            this.rmsle = rmsle;
            this.wmape = wmape;
        }

        public double getR2Score() {
            return r2Score;
        }

        public void setR2Score(double r2Score) {
            this.r2Score = r2Score;
        }

        public double getMae() {
            return mae;
        }

        public void setMae(double mae) {
            this.mae = mae;
        }

        public double getRmsle() {
            return rmsle;
        }

        public void setRmsle(double rmsle) {
            this.rmsle = rmsle;
        }

        public double getWmape() {
            return wmape;
        }

        public void setWmape(double wmape) {
            this.wmape = wmape;
        }
    }
}
