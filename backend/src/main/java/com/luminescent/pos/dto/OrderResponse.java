package com.luminescent.pos.dto;

public class OrderResponse {
    private Long orderId;
    private Double totalAmount;

    public OrderResponse(Long orderId, Double totalAmount) {
        this.orderId = orderId;
        this.totalAmount = totalAmount;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
}
