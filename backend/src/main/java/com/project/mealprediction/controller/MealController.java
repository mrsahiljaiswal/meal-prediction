package com.project.mealprediction.controller;

import com.project.mealprediction.entity.Meal;
import com.project.mealprediction.service.MealService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/meals")
@RequiredArgsConstructor
public class MealController {

    private final MealService mealService;
    @PostMapping
    public Meal saveMeal(@RequestBody Meal meal) {
        return mealService.saveMeal(meal);
    }
}