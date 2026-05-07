package com.luminescent.pos.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class OrderRequest {

    @NotEmpty
    @Valid
    private List<OrderItemRequest> items;

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }

    public static class OrderItemRequest {
        @NotNull
        private Long mealId;

        @NotNull
        @Min(1)
        private Integer quantity;

        public Long getMealId() {
            return mealId;
        }

        public void setMealId(Long mealId) {
            this.mealId = mealId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }
}
