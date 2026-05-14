package com.luminescent.pos.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "meals")
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Auto-generated unique row ID

    @Column(name = "meal_id")
    private Long mealId; // The ID linked to the ML model (1885, etc)

    @Column(name = "center_id")
    private Long centerId;

    private String name;
    private Double basePrice;
    private Double checkoutPrice;
    private Integer emailerForPromotion;
    private Integer homepageFeatured;
    @Column(name = "image_url")
    private String imageUrl;
    // 1. Default constructor required by JPA/Hibernate
    public Meal() {
    }

    // 2. Parameterized constructor to fix the instantiation error
    public Meal(Long id, String category, String cuisine, Double price) {
        this.id = id;
        this.name = category + " (" + cuisine + ")"; // e.g., "Beverages (Thai)"
        this.basePrice = price;
        this.checkoutPrice = price;
    }

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
        return Math.toIntExact(centerId);
    }

    public void setCenterId(Integer centerId) {
        this.centerId = Long.valueOf(centerId);
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

    public String getImageUrl() {return imageUrl;}

    public Long getMealId() {
        return this.mealId;
    }
}
