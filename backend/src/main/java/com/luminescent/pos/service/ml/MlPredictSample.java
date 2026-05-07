package com.luminescent.pos.service.ml;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MlPredictSample {
    private Long id;
    private Integer week;

    @JsonProperty("center_id")
    private Integer centerId;

    @JsonProperty("meal_id")
    private Long mealId;

    @JsonProperty("checkout_price")
    private Double checkoutPrice;

    @JsonProperty("base_price")
    private Double basePrice;

    @JsonProperty("emailer_for_promotion")
    private Integer emailerForPromotion;

    @JsonProperty("homepage_featured")
    private Integer homepageFeatured;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getWeek() {
        return week;
    }

    public void setWeek(Integer week) {
        this.week = week;
    }

    public Integer getCenterId() {
        return centerId;
    }

    public void setCenterId(Integer centerId) {
        this.centerId = centerId;
    }

    public Long getMealId() {
        return mealId;
    }

    public void setMealId(Long mealId) {
        this.mealId = mealId;
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

    public Integer getEmailerForPromotion() {
        return emailerForPromotion;
    }

    public void setEmailerForPromotion(Integer emailerForPromotion) {
        this.emailerForPromotion = emailerForPromotion;
    }

    public Integer getHomepageFeatured() {
        return homepageFeatured;
    }

    public void setHomepageFeatured(Integer homepageFeatured) {
        this.homepageFeatured = homepageFeatured;
    }
}

