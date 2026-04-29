package com.project.mealprediction.repository;

import com.project.mealprediction.entity.Meal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MealRepository extends JpaRepository<Meal, Long> {
    Optional<Meal> findByMealCode(Integer mealCode);
}
