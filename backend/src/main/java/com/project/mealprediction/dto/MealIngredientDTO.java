package com.project.mealprediction.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MealIngredientDTO {

    private Integer mealCode;
    private Long ingredientId;
    private Double quantityRequired;
}
