package com.luminescent.pos.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class BaselineSalesResponse {
    private String status;
    @JsonProperty("center_id")
    private Long centerId;
    @JsonProperty("baseline_sales")
    private List<BaselineSalesData> baselineSales;

    public BaselineSalesResponse() {
    }

    public BaselineSalesResponse(String status, Long centerId, List<BaselineSalesData> baselineSales) {
        this.status = status;
        this.centerId = centerId;
        this.baselineSales = baselineSales;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getCenterId() {
        return centerId;
    }

    public void setCenterId(Long centerId) {
        this.centerId = centerId;
    }

    public List<BaselineSalesData> getBaselineSales() {
        return baselineSales;
    }

    public void setBaselineSales(List<BaselineSalesData> baselineSales) {
        this.baselineSales = baselineSales;
    }

    public static class BaselineSalesData {
        private int week;
        @JsonProperty("meal_id")
        private Long mealId;
        @JsonProperty("avg_orders")
        private double avgOrders;
        @JsonProperty("checkout_price")
        private double checkoutPrice;
        @JsonProperty("base_price")
        private double basePrice;
        @JsonProperty("emailer_for_promotion")
        private int emailerForPromotion;
        @JsonProperty("homepage_featured")
        private int homepageFeatured;

        public BaselineSalesData() {
        }

        public BaselineSalesData(int week, Long mealId, double avgOrders, double checkoutPrice,
                                 double basePrice, int emailerForPromotion, int homepageFeatured) {
            this.week = week;
            this.mealId = mealId;
            this.avgOrders = avgOrders;
            this.checkoutPrice = checkoutPrice;
            this.basePrice = basePrice;
            this.emailerForPromotion = emailerForPromotion;
            this.homepageFeatured = homepageFeatured;
        }

        public int getWeek() {
            return week;
        }

        public void setWeek(int week) {
            this.week = week;
        }

        public Long getMealId() {
            return mealId;
        }

        public void setMealId(Long mealId) {
            this.mealId = mealId;
        }

        public double getAvgOrders() {
            return avgOrders;
        }

        public void setAvgOrders(double avgOrders) {
            this.avgOrders = avgOrders;
        }

        public double getCheckoutPrice() {
            return checkoutPrice;
        }

        public void setCheckoutPrice(double checkoutPrice) {
            this.checkoutPrice = checkoutPrice;
        }

        public double getBasePrice() {
            return basePrice;
        }

        public void setBasePrice(double basePrice) {
            this.basePrice = basePrice;
        }

        public int getEmailerForPromotion() {
            return emailerForPromotion;
        }

        public void setEmailerForPromotion(int emailerForPromotion) {
            this.emailerForPromotion = emailerForPromotion;
        }

        public int getHomepageFeatured() {
            return homepageFeatured;
        }

        public void setHomepageFeatured(int homepageFeatured) {
            this.homepageFeatured = homepageFeatured;
        }
    }
}
