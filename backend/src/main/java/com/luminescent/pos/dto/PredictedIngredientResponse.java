package com.luminescent.pos.dto;

public class PredictedIngredientResponse {
    private String ingredientName;
    private Double predictedRequiredAmount;
    private Double currentStockQuantity;
    private Double amountToOrder;

    public PredictedIngredientResponse(String ingredientName, Double predictedRequiredAmount, Double currentStockQuantity, Double amountToOrder) {
        this.ingredientName = ingredientName;
        this.predictedRequiredAmount = predictedRequiredAmount;
        this.currentStockQuantity = currentStockQuantity;
        this.amountToOrder = amountToOrder;
    }

    public String getIngredientName() {
        return ingredientName;
    }

    public void setIngredientName(String ingredientName) {
        this.ingredientName = ingredientName;
    }

    public Double getPredictedRequiredAmount() {
        return predictedRequiredAmount;
    }

    public void setPredictedRequiredAmount(Double predictedRequiredAmount) {
        this.predictedRequiredAmount = predictedRequiredAmount;
    }

    public Double getCurrentStockQuantity() {
        return currentStockQuantity;
    }

    public void setCurrentStockQuantity(Double currentStockQuantity) {
        this.currentStockQuantity = currentStockQuantity;
    }

    public Double getAmountToOrder() {
        return amountToOrder;
    }

    public void setAmountToOrder(Double amountToOrder) {
        this.amountToOrder = amountToOrder;
    }
}
