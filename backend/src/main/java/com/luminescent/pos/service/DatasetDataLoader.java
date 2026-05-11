package com.luminescent.pos.service;

import com.luminescent.pos.entity.Meal;
import com.luminescent.pos.repository.MealRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DatasetDataLoader implements CommandLineRunner {

    @Autowired
    private MealRepository mealRepository;

    @Override
    public void run(String... args) throws Exception {
        if (mealRepository.count() == 0) {
            System.out.println("Populating relevant database inferences...");

            // Populating high-quality data correlating to meal_info.csv for proper Model predictions
            List<Meal> initialMeals = Arrays.asList(
                    new Meal(1885L, "Beverages", "Thai", 250.0),
                    new Meal(1993L, "Beverages", "Thai", 200.0),
                    new Meal(2539L, "Beverages", "Thai", 150.0),
                    new Meal(1248L, "Beverages", "Indian", 100.0),
                    new Meal(2631L, "Pizza", "Continental", 400.0),
                    new Meal(1311L, "Extras", "Thai", 120.0),
                    new Meal(1062L, "Beverages", "Italian", 210.0),
                    new Meal(1778L, "Beverages", "Italian", 185.0)
            );
            mealRepository.saveAll(initialMeals);

            System.out.println("Sample Data loaded successfully! Analytics dashboards are ready.");
        }
    }
}