package com.project.mealprediction.service;

import com.project.mealprediction.entity.Meal;
import com.project.mealprediction.repository.MealRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MealService {

    private final MealRepository mealRepository;
    public Meal saveMeal(Meal meal) {
        return mealRepository.save(meal);
    }
}
