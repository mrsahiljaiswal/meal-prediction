package com.luminescent.pos.controller;

import com.luminescent.pos.repository.IngredientRepository;
import com.luminescent.pos.repository.MealIngredientMappingRepository;
import com.luminescent.pos.repository.MealRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final MealRepository mealRepository;
    private final IngredientRepository ingredientRepository;
    private final MealIngredientMappingRepository mappingRepository;

    public AdminController(MealRepository mealRepository,
                            IngredientRepository ingredientRepository,
                            MealIngredientMappingRepository mappingRepository) {
        this.mealRepository = mealRepository;
        this.ingredientRepository = ingredientRepository;
        this.mappingRepository = mappingRepository;
    }

    @GetMapping("/status")
    public Map<String, Object> status() {
        return Map.of(
                "mealsCount", mealRepository.count(),
                "ingredientsCount", ingredientRepository.count(),
                "mealIngredientMappingsCount", mappingRepository.count()
        );
    }
}

