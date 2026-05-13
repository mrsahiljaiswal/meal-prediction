package com.luminescent.pos.service;

import com.luminescent.pos.entity.Ingredient;
import com.luminescent.pos.entity.MealRecipe;
import com.luminescent.pos.repository.MealRecipeRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RecipeConsumptionService {

    private final MealRecipeRepository mealRecipeRepository;

    public RecipeConsumptionService(
            MealRecipeRepository mealRecipeRepository
    ) {
        this.mealRecipeRepository = mealRecipeRepository;
    }

    public void consumeIngredients(
            Long mealId,
            int quantityOrdered
    ) {

        List<MealRecipe> recipes =
                mealRecipeRepository.findByMealId(mealId);

        for (MealRecipe recipe : recipes) {

            Ingredient ingredient =
                    recipe.getIngredient();

            double required =
                    recipe.getQuantityRequired()
                            * quantityOrdered;

            double wastage =
                    required
                            * (recipe.getWastagePercentage() / 100);

            double totalRequired =
                    required + wastage;

            double currentStock =
                    ingredient.getCurrentStockQuantity();

            if (currentStock < totalRequired) {

                throw new RuntimeException(
                        "Insufficient stock for ingredient: "
                                + ingredient.getName()
                );
            }

            ingredient.setCurrentStockQuantity(
                    currentStock - totalRequired
            );
        }
    }
}