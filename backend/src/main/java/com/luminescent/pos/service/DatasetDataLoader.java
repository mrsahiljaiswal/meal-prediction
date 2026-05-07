package com.luminescent.pos.service;

import com.luminescent.pos.entity.Meal;
import com.luminescent.pos.repository.MealRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Component
@ConditionalOnProperty(name = "luminescent.dataloader.enabled", havingValue = "true")
@Order(10)
public class DatasetDataLoader implements ApplicationRunner {

    private final MealRepository mealRepository;

    public DatasetDataLoader(MealRepository mealRepository) {
        this.mealRepository = mealRepository;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        Map<Long, String> mealNamesById = loadMealNames();
        upsertMealsFromTrain(mealNamesById);
    }

    private Map<Long, String> loadMealNames() throws Exception {
        ClassPathResource resource = new ClassPathResource("meal_info.csv");
        Map<Long, String> names = new HashMap<>();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8));
             CSVParser parser = CSVFormat.DEFAULT.withFirstRecordAsHeader().parse(reader)) {
            for (CSVRecord record : parser) {
                long mealId = Long.parseLong(record.get("meal_id"));
                String category = record.get("category");
                String cuisine = record.get("cuisine");
                String name = (cuisine + " " + category).trim();
                names.put(mealId, name);
            }
        }

        return names;
    }

    private void upsertMealsFromTrain(Map<Long, String> mealNamesById) throws Exception {
        ClassPathResource resource = new ClassPathResource("train.csv");

        Map<Long, Meal> mealsByMealId = new HashMap<>();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8));
             CSVParser parser = CSVFormat.DEFAULT.withFirstRecordAsHeader().parse(reader)) {

            for (CSVRecord record : parser) {
                long mealId = Long.parseLong(record.get("meal_id"));
                if (mealsByMealId.containsKey(mealId)) {
                    continue;
                }

                Meal meal = new Meal();
                meal.setId(mealId);
                meal.setName(mealNamesById.getOrDefault(mealId, "Meal " + mealId));
                meal.setCenterId(Integer.parseInt(record.get("center_id")));
                meal.setCheckoutPrice(Double.parseDouble(record.get("checkout_price")));
                meal.setBasePrice(Double.parseDouble(record.get("base_price")));
                meal.setEmailerForPromotion(Integer.parseInt(record.get("emailer_for_promotion")));
                meal.setHomepageFeatured(Integer.parseInt(record.get("homepage_featured")));

                mealsByMealId.put(mealId, meal);
            }
        }

        mealRepository.saveAll(mealsByMealId.values());
    }
}

