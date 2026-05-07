package com.luminescent.pos.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "meals")
public class Meal {

    @Id
    private Long id;
    private String name;
    private Double basePrice;
    private Double checkoutPrice;
    private Integer centerId;
    private Integer emailerForPromotion;
    private Integer homepageFeatured;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(Double basePrice) {
        this.basePrice = basePrice;
    }

    public Double getCheckoutPrice() {
        return checkoutPrice;
    }

    public void setCheckoutPrice(Double checkoutPrice) {
        this.checkoutPrice = checkoutPrice;
    }

    public Integer getCenterId() {
        return centerId;
    }

    public void setCenterId(Integer centerId) {
        this.centerId = centerId;
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
