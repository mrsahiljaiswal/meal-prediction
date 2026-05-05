package com.project.mealprediction.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "meal_ingredients",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"meal_id", "ingredient_id"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MealIngredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "meal_id")
    private Meal meal;

    @ManyToOne
    @JoinColumn(name = "ingredient_id")
    private Ingredient ingredient;

    private Double quantityRequired;
}