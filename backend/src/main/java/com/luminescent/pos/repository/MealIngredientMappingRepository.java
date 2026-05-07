package com.luminescent.pos.repository;

import com.luminescent.pos.entity.MealIngredientMapping;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MealIngredientMappingRepository extends JpaRepository<MealIngredientMapping, Long> {
    List<MealIngredientMapping> findByMeal_Id(Long mealId);
    List<MealIngredientMapping> findByMeal_IdIn(List<Long> mealIds);
}
