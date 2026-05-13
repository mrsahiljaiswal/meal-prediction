package com.luminescent.pos.repository;

import com.luminescent.pos.entity.MealRecipe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MealRecipeRepository
        extends JpaRepository<MealRecipe, Long> {

    List<MealRecipe> findByMealId(Long mealId);

    List<MealRecipe> findByMeal_IdIn(List<Long> mealIds);
}