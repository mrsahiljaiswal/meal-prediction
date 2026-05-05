package com.project.mealprediction.controller;

import com.project.mealprediction.dto.MealIngredientDTO;
import com.project.mealprediction.service.MealIngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/meal-ingredients")
public class MealIngredientController {

    private final MealIngredientService mealIngredientService;
    @PostMapping
    public String saveMapping(@RequestBody MealIngredientDTO dto) {
        return mealIngredientService.saveMapping(dto);
    }
}