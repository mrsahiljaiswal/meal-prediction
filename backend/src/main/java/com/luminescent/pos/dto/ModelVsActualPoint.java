package com.luminescent.pos.dto;

public class ModelVsActualPoint {
    private Long mealId;
    private Integer week;
    private Double actualOrders;
    private Double predictedOrders;
    private Double checkoutPrice;
    private Double basePrice;
    private Double modelProfit;
    private Double baselineOrders;
    private Double baselineProfit;

    public ModelVsActualPoint(Long mealId, Integer week, Double actualOrders, Double predictedOrders) {
        this(mealId, week, actualOrders, predictedOrders, null, null, null, null, null);
    }

    public ModelVsActualPoint(Long mealId,
                              Integer week,
                              Double actualOrders,
                              Double predictedOrders,
                              Double checkoutPrice,
                              Double basePrice,
                              Double modelProfit,
                              Double baselineOrders,
                              Double baselineProfit) {
        this.mealId = mealId;
        this.week = week;
        this.actualOrders = actualOrders;
        this.predictedOrders = predictedOrders;
        this.checkoutPrice = checkoutPrice;
        this.basePrice = basePrice;
        this.modelProfit = modelProfit;
        this.baselineOrders = baselineOrders;
        this.baselineProfit = baselineProfit;
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

    public Double getCheckoutPrice() {
        return checkoutPrice;
    }

    public void setCheckoutPrice(Double checkoutPrice) {
        this.checkoutPrice = checkoutPrice;
    }

    public Double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(Double basePrice) {
        this.basePrice = basePrice;
    }

    public Double getModelProfit() {
        return modelProfit;
    }

    public void setModelProfit(Double modelProfit) {
        this.modelProfit = modelProfit;
    }

    public Double getBaselineOrders() {
        return baselineOrders;
    }

    public void setBaselineOrders(Double baselineOrders) {
        this.baselineOrders = baselineOrders;
    }

    public Double getBaselineProfit() {
        return baselineProfit;
    }

    public void setBaselineProfit(Double baselineProfit) {
        this.baselineProfit = baselineProfit;
    }
}

