package com.luminescent.pos.service;

import com.luminescent.pos.entity.Ingredient;
import com.luminescent.pos.entity.Meal;
import com.luminescent.pos.entity.MealIngredientMapping;
import com.luminescent.pos.repository.IngredientRepository;
import com.luminescent.pos.repository.MealIngredientMappingRepository;
import com.luminescent.pos.repository.MealRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
@ConditionalOnProperty(name = "luminescent.dataloader.ingredients.enabled", havingValue = "true")
@Order(20)
public class IngredientDataLoader implements ApplicationRunner {

    private static final List<String> DEMO_INGREDIENT_NAMES = List.of(
            "Tomato",
            "Onion",
            "Garlic",
            "Cheese",
            "Chicken",
            "Beef",
            "Lettuce",
            "Potato",
            "Rice",
            "Spices",
            "Olive Oil",
            "Pasta Sauce"
    );

    private final IngredientRepository ingredientRepository;
    private final MealRepository mealRepository;
    private final MealIngredientMappingRepository mappingRepository;

    public IngredientDataLoader(IngredientRepository ingredientRepository,
                                 MealRepository mealRepository,
                                 MealIngredientMappingRepository mappingRepository) {
        this.ingredientRepository = ingredientRepository;
        this.mealRepository = mealRepository;
        this.mappingRepository = mappingRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (mappingRepository.count() > 0) {
            // Keep mappings as-is, but normalize stocks to lower values for prediction demos.
            normalizeIngredientStocks();
            return;
        }

        Map<String, Ingredient> ingredientByName;
        if (ingredientRepository.count() > 0) {
            ingredientByName = loadIngredientByName();
        } else {
            ingredientByName = createIngredients();
        }
        createMappings(ingredientByName);
        normalizeIngredientStocks();
    }

    private Map<String, Ingredient> loadIngredientByName() {
        Map<String, Ingredient> byName = new HashMap<>();
        for (Ingredient ing : ingredientRepository.findAll()) {
            if (ing.getName() != null) {
                byName.put(ing.getName(), ing);
            }
        }
        return byName;
    }

    private Map<String, Ingredient> createIngredients() {
        List<Ingredient> ingredients = new ArrayList<>();
        for (String name : DEMO_INGREDIENT_NAMES) {
            Ingredient ingredient = new Ingredient();
            ingredient.setName(name);
            ingredient.setUnitOfMeasure("g");
            ingredient.setCurrentStockQuantity(200.0);
            ingredients.add(ingredient);
        }
        List<Ingredient> saved = ingredientRepository.saveAll(ingredients);

        Map<String, Ingredient> byName = new HashMap<>();
        for (Ingredient ing : saved) {
            byName.put(ing.getName(), ing);
        }
        return byName;
    }

    @Transactional
    protected void createMappings(Map<String, Ingredient> ingredientByName) {
        List<Meal> meals = mealRepository.findAll();
        int ingredientCount = DEMO_INGREDIENT_NAMES.size();

        List<MealIngredientMapping> mappings = new ArrayList<>();
        for (Meal meal : meals) {
            long mealId = meal.getId();

            // Deterministically pick ingredients per meal (demo only).
            Set<Integer> chosenIdx = new LinkedHashSet<>();
            chosenIdx.add((int) (Math.abs(mealId) % ingredientCount));
            chosenIdx.add((int) (Math.abs(mealId / 3) % ingredientCount));
            chosenIdx.add((int) (Math.abs(mealId / 7) % ingredientCount));
            chosenIdx.add((int) (Math.abs(mealId / 11) % ingredientCount));

            for (int idx : chosenIdx) {
                String ingredientName = DEMO_INGREDIENT_NAMES.get(idx);
                Ingredient ingredient = ingredientByName.get(ingredientName);

                MealIngredientMapping mapping = new MealIngredientMapping();
                mapping.setMeal(meal);
                mapping.setIngredient(ingredient);

                // Small quantity so predicted totals stay readable in UI.
                double quantityRequired = 0.05 * (1 + (mealId % 5)); // 0.05 to 0.25
                mapping.setQuantityRequired(quantityRequired);
                mappings.add(mapping);
            }
        }

        mappingRepository.saveAll(mappings);
    }

    private void normalizeIngredientStocks() {
        List<Ingredient> ingredients = ingredientRepository.findAll();
        if (ingredients.isEmpty()) {
            return;
        }

        for (Ingredient ingredient : ingredients) {
            long id = ingredient.getId() == null ? 1L : ingredient.getId();
            // Keep stock intentionally low so "amountToOrder" is visible in dashboard.
            double stock = 60.0 + ((id % 6) * 25.0); // 60 to 185
            ingredient.setCurrentStockQuantity(stock);
        }
        ingredientRepository.saveAll(ingredients);
    }
}

