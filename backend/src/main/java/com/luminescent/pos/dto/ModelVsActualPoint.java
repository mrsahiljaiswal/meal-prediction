package com.luminescent.pos.dto;

public class ModelVsActualPoint {
    private Long mealId;
    private Integer week;
    private Double actualOrders;
    private Double predictedOrders;

    public ModelVsActualPoint(Long mealId, Integer week, Double actualOrders, Double predictedOrders) {
        this.mealId = mealId;
        this.week = week;
        this.actualOrders = actualOrders;
        this.predictedOrders = predictedOrders;
    }

    public Long getMealId() {
        return mealId;
    }

    public void setMealId(Long mealId) {
        this.mealId = mealId;
    }

    public Integer getWeek() {
        return week;
    }

    public void setWeek(Integer week) {
        this.week = week;
    }

    public Double getActualOrders() {
        return actualOrders;
    }

    public void setActualOrders(Double actualOrders) {
        this.actualOrders = actualOrders;
    }

    public Double getPredictedOrders() {
        return predictedOrders;
    }

    public void setPredictedOrders(Double predictedOrders) {
        this.predictedOrders = predictedOrders;
    }
}

