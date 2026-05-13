package com.luminescent.pos.controller;

import com.luminescent.pos.entity.Meal;
import com.luminescent.pos.repository.MealRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/meals")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class MealController {

    private final MealRepository mealRepository;

    public MealController(MealRepository mealRepository) {
        this.mealRepository = mealRepository;
    }

    @GetMapping
    public List<Meal> getMeals() {
        return mealRepository.findAll();
    }

    @GetMapping("/center/{centerId}")
    public List<Meal> getMealsByCenter(@PathVariable Integer centerId) {
        return mealRepository.findByCenterId(centerId);
    }
}
