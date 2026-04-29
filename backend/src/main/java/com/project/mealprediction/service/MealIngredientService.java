package com.project.mealprediction.service;

import com.project.mealprediction.dto.MealIngredientDTO;
import com.project.mealprediction.entity.*;
import com.project.mealprediction.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MealIngredientService {

    private final MealRepository mealRepository;
    private final IngredientRepository ingredientRepository;
    private final MealIngredientRepository mealIngredientRepository;


    public String saveMapping(MealIngredientDTO dto) {

        Meal meal = mealRepository.findByMealCode(dto.getMealCode())
                .orElseThrow();

        Ingredient ingredient = ingredientRepository.findById(dto.getIngredientId())
                .orElseThrow();

        MealIngredient mapping = new MealIngredient();
        mapping.setMeal(meal);
        mapping.setIngredient(ingredient);
        mapping.setQuantityRequired(dto.getQuantityRequired());

        mealIngredientRepository.save(mapping);

        return "Mapping saved";
    }
}