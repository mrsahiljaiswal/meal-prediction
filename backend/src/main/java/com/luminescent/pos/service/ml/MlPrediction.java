package com.luminescent.pos.service.ml;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MlPrediction {
    @JsonProperty("meal_id")
    private Long mealId;

    @JsonProperty("predicted_orders")
    private Double predictedOrders;

    public Long getMealId() {
        return mealId;
    }

    public void setMealId(Long mealId) {
        this.mealId = mealId;
    }

    public Double getPredictedOrders() {
        return predictedOrders;
    }

    public void setPredictedOrders(Double predictedOrders) {
        this.predictedOrders = predictedOrders;
    }
}

