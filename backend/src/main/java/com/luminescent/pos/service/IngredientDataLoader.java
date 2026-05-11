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
import java.util.List;
import java.util.Map;

@Component
@ConditionalOnProperty(name = "luminescent.dataloader.ingredients.enabled", havingValue = "true")
@Order(20)
public class IngredientDataLoader implements ApplicationRunner {

    // Expanded realistic ingredient list
    private static final List<String> DEMO_INGREDIENT_NAMES = List.of(
            "Tomato", "Onion", "Garlic", "Cheese", "Chicken", "Beef",
            "Lettuce", "Potato", "Rice", "Spices", "Olive Oil", "Pasta Sauce",
            "Pizza Dough", "Milk", "Sugar", "Coffee Beans", "Seafood", "Bread"
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
        // Set realistic base units (e.g., Kg for heavy items, Liters/Grams for others)
        for (String name : DEMO_INGREDIENT_NAMES) {
            Ingredient ingredient = new Ingredient();
            ingredient.setName(name);

            if (name.equals("Milk") || name.equals("Olive Oil")) {
                ingredient.setUnitOfMeasure("L");
            } else {
                ingredient.setUnitOfMeasure("Kg");
            }

            ingredient.setCurrentStockQuantity(50.0);
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
        List<MealIngredientMapping> mappings = new ArrayList<>();

        for (Meal meal : meals) {
            String mealName = meal.getName() != null ? meal.getName().toLowerCase() : "";

            // Map realistic ingredients based on the meal's name/category
            Map<String, Double> requiredIngredients = new HashMap<>();

            if (mealName.contains("pizza")) {
                requiredIngredients.put("Pizza Dough", 0.4);
                requiredIngredients.put("Cheese", 0.2);
                requiredIngredients.put("Tomato", 0.1);
                requiredIngredients.put("Pasta Sauce", 0.1);
            } else if (mealName.contains("beverage")) {
                requiredIngredients.put("Milk", 0.2);
                requiredIngredients.put("Sugar", 0.05);
                requiredIngredients.put("Coffee Beans", 0.05);
            } else if (mealName.contains("pasta")) {
                requiredIngredients.put("Pasta Sauce", 0.2);
                requiredIngredients.put("Cheese", 0.05);
                requiredIngredients.put("Garlic", 0.02);
                requiredIngredients.put("Olive Oil", 0.02);
            } else if (mealName.contains("seafood")) {
                requiredIngredients.put("Seafood", 0.3);
                requiredIngredients.put("Spices", 0.02);
                requiredIngredients.put("Garlic", 0.01);
            } else if (mealName.contains("rice") || mealName.contains("biryani")) {
                requiredIngredients.put("Rice", 0.3);
                requiredIngredients.put("Chicken", 0.2);
                requiredIngredients.put("Spices", 0.05);
                requiredIngredients.put("Onion", 0.05);
            } else if (mealName.contains("sandwich")) {
                requiredIngredients.put("Bread", 0.2);
                requiredIngredients.put("Cheese", 0.05);
                requiredIngredients.put("Lettuce", 0.05);
                requiredIngredients.put("Tomato", 0.05);
            } else {
                // Generic fallback for "Extras", "Starters", etc.
                requiredIngredients.put("Potato", 0.2);
                requiredIngredients.put("Olive Oil", 0.02);
                requiredIngredients.put("Spices", 0.01);
            }

            // Create the mapping entities
            for (Map.Entry<String, Double> entry : requiredIngredients.entrySet()) {
                Ingredient ingredient = ingredientByName.get(entry.getKey());
                if (ingredient != null) {
                    MealIngredientMapping mapping = new MealIngredientMapping();
                    mapping.setMeal(meal);
                    mapping.setIngredient(ingredient);
                    mapping.setQuantityRequired(entry.getValue());
                    mappings.add(mapping);
                }
            }
        }

        mappingRepository.saveAll(mappings);
    }

    private void normalizeIngredientStocks() {
        List<Ingredient> ingredients = ingredientRepository.findAll();
        if (ingredients.isEmpty()) return;

        for (Ingredient ingredient : ingredients) {
            // Give slightly varied, realistic current stock limits (between 10 and 40 Kg/L)
            long id = ingredient.getId() == null ? 1L : ingredient.getId();
            double stock = 10.0 + ((id % 4) * 10.0);
            ingredient.setCurrentStockQuantity(stock);
        }
        ingredientRepository.saveAll(ingredients);
    }
}