package com.luminescent.pos.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ingredients")
public class Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Double currentStockQuantity;
    @Enumerated(EnumType.STRING)
    private Unit unit;

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

    public Double getCurrentStockQuantity() {
        return currentStockQuantity;
    }

    public void setCurrentStockQuantity(Double currentStockQuantity) {
        this.currentStockQuantity = currentStockQuantity;
    }

    public Unit getUnit() {
        return unit;
    }

    public void setUnit(Unit unitOfMeasure) {
        this.unit = unitOfMeasure;
    }
}
