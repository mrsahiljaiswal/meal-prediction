package com.luminescent.pos.dto;

public class CenterInventoryResponse {

    private Long ingredientId;
    private String ingredientName;
    private String unit;
    private Double currentStockQuantity;

    public CenterInventoryResponse(
            Long ingredientId,
            String ingredientName,
            String unit,
            Double currentStockQuantity
    ) {
        this.ingredientId = ingredientId;
        this.ingredientName = ingredientName;
        this.unit = unit;
        this.currentStockQuantity = currentStockQuantity;
    }

    public Long getIngredientId() {
        return ingredientId;
    }

    public String getIngredientName() {
        return ingredientName;
    }

    public String getUnit() {
        return unit;
    }

    public Double getCurrentStockQuantity() {
        return currentStockQuantity;
    }
}
