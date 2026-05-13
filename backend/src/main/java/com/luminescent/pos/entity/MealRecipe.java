package com.luminescent.pos.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "meal_recipe")
public class MealRecipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meal_id", nullable = false)
    private Meal meal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingredient_id", nullable = false)
    private Ingredient ingredient;

    @Column(name = "quantity_required", nullable = false)
    private Double quantityRequired;

    @Column(nullable = false)
    private String unit;

    @Column(name = "wastage_percentage")
    private Double wastagePercentage = 0.0;

    public MealRecipe() {}

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Meal getMeal() {
        return meal;
    }

    public void setMeal(Meal meal) {
        this.meal = meal;
    }

    public Ingredient getIngredient() {
        return ingredient;
    }

    public void setIngredient(Ingredient ingredient) {
        this.ingredient = ingredient;
    }

    public double getQuantityRequired() {
        return quantityRequired;
    }

    public void setQuantityRequired(Double quantityRequired) {
        this.quantityRequired = quantityRequired;
    }

    public Unit getUnit() {
        return Unit.valueOf(unit);
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Double getWastagePercentage() {
        return wastagePercentage;
    }

    public void setWastagePercentage(Double wastagePercentage) {
        this.wastagePercentage = wastagePercentage;
    }
}
