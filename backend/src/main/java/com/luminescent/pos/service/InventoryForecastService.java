package com.luminescent.pos.service;

import com.luminescent.pos.service.ml.MlPredictRequest;
import com.luminescent.pos.service.ml.MlPredictResponse;
import com.luminescent.pos.service.ml.MlApiHealthResponse;
import com.luminescent.pos.service.ml.MlPredictSample;
import com.luminescent.pos.service.ml.MlPrediction;
import com.luminescent.pos.dto.ModelVsActualPoint;
import com.luminescent.pos.dto.ModelVsActualResponse;
import com.luminescent.pos.dto.PredictedIngredientResponse;
import com.luminescent.pos.entity.Ingredient;
import com.luminescent.pos.entity.Meal;
import com.luminescent.pos.entity.MealIngredientMapping;
import com.luminescent.pos.repository.MealIngredientMappingRepository;
import com.luminescent.pos.repository.MealRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class InventoryForecastService {

    private final MealRepository mealRepository;
    private final MealIngredientMappingRepository mappingRepository;
    private final WebClient webClient;

    public InventoryForecastService(MealRepository mealRepository,
                                    MealIngredientMappingRepository mappingRepository,
                                    WebClient webClient) {
        this.mealRepository = mealRepository;
        this.mappingRepository = mappingRepository;
        this.webClient = webClient;
    }

    public List<PredictedIngredientResponse> predictNextWeekIngredientDemand() {
        List<Meal> meals = mealRepository.findAll();
        if (meals.isEmpty()) {
            return List.of();
        }

        int week = java.time.LocalDate.now()
                .plusDays(7)
                .get(java.time.temporal.WeekFields.ISO.weekOfWeekBasedYear());

        // Build request matching the Python API contract.
        MlPredictRequest request = new MlPredictRequest();
        List<MlPredictSample> samples = new ArrayList<>();

        for (int i = 0; i < meals.size(); i++) {
            Meal meal = meals.get(i);
            MlPredictSample sample = new MlPredictSample();
            sample.setId((long) (i + 1));
            sample.setWeek(week);
            sample.setCenterId(meal.getCenterId());
            sample.setMealId(meal.getId());
            sample.setCheckoutPrice(meal.getCheckoutPrice());
            sample.setBasePrice(meal.getBasePrice());
            sample.setEmailerForPromotion(meal.getEmailerForPromotion());
            sample.setHomepageFeatured(meal.getHomepageFeatured());
            samples.add(sample);
        }
        request.setSamples(samples);

        MlPredictResponse predictionResponse;
        try {
            predictionResponse = webClient.post()
                    .uri("/predict")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(MlPredictResponse.class)
                    .block();
        } catch (Exception e) {
            throw new ResponseStatusException(
                    502,
                    "ML API call failed: " + e.getMessage(),
                    e
            );
        }

        List<MlPrediction> predictions = predictionResponse == null
                ? List.of()
                : predictionResponse.getPredictions();

        Map<Long, Double> predictedOrdersByMealId = new HashMap<>();
        for (MlPrediction prediction : predictions) {
            if (prediction.getMealId() != null && prediction.getPredictedOrders() != null) {
                predictedOrdersByMealId.put(prediction.getMealId(), prediction.getPredictedOrders());
            }
        }

        List<Long> mealIds = new ArrayList<>(predictedOrdersByMealId.keySet());
        if (mealIds.isEmpty()) {
            return List.of();
        }

        List<MealIngredientMapping> mappings = mappingRepository.findByMeal_IdIn(mealIds);

        Map<Long, Double> predictedByIngredientId = new HashMap<>();
        Map<Long, Ingredient> ingredientById = new HashMap<>();

        for (MealIngredientMapping mapping : mappings) {
            long mealId = mapping.getMeal().getId();
            double predictedOrders = predictedOrdersByMealId.getOrDefault(mealId, 0.0);
            double requiredAmount = predictedOrders * mapping.getQuantityRequired();
            long ingredientId = mapping.getIngredient().getId();

            predictedByIngredientId.merge(ingredientId, requiredAmount, Double::sum);
            ingredientById.put(ingredientId, mapping.getIngredient());
        }

        List<PredictedIngredientResponse> responses = new ArrayList<>();
        for (Map.Entry<Long, Double> entry : predictedByIngredientId.entrySet()) {
            Ingredient ingredient = ingredientById.get(entry.getKey());
            double predictedRequired = entry.getValue();
            double currentStock = ingredient.getCurrentStockQuantity() == null ? 0.0 : ingredient.getCurrentStockQuantity();
            double amountToOrder = Math.max(0.0, predictedRequired - currentStock);

            responses.add(new PredictedIngredientResponse(
                    ingredient.getName(),
                    predictedRequired,
                    currentStock,
                    amountToOrder
            ));
        }

        return responses;
    }

    public MlApiHealthResponse checkMlApi() {
        Meal meal = mealRepository.findFirstByOrderByIdAsc().orElse(null);
        if (meal == null) {
            return MlApiHealthResponse.error("No meals in database; seed loader might not have run.");
        }

        int week = java.time.LocalDate.now()
                .plusDays(7)
                .get(java.time.temporal.WeekFields.ISO.weekOfWeekBasedYear());

        MlPredictRequest request = new MlPredictRequest();
        MlPredictSample sample = new MlPredictSample();
        sample.setId(1L);
        sample.setWeek(week);
        sample.setCenterId(meal.getCenterId());
        sample.setMealId(meal.getId());
        sample.setCheckoutPrice(meal.getCheckoutPrice());
        sample.setBasePrice(meal.getBasePrice());
        sample.setEmailerForPromotion(meal.getEmailerForPromotion());
        sample.setHomepageFeatured(meal.getHomepageFeatured());
        request.setSamples(List.of(sample));

        try {
            MlPredictResponse response = webClient.post()
                    .uri("/predict")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(MlPredictResponse.class)
                    .block();

            int count = response == null || response.getPredictions() == null
                    ? 0
                    : response.getPredictions().size();

            return MlApiHealthResponse.ok(count);
        } catch (Exception e) {
            return MlApiHealthResponse.error("ML API call failed: " + e.getMessage());
        }
    }

    public ModelVsActualResponse getModelVsActual(int limit) {
        int safeLimit = Math.max(5, Math.min(limit, 120));
        List<TrainSampleRow> rows = loadTrainSamples(safeLimit);
        if (rows.isEmpty()) {
            return new ModelVsActualResponse(0, 0, 0, List.of());
        }

        MlPredictRequest request = new MlPredictRequest();
        List<MlPredictSample> samples = new ArrayList<>();
        for (TrainSampleRow row : rows) {
            MlPredictSample sample = new MlPredictSample();
            sample.setId(row.id());
            sample.setWeek(row.week());
            sample.setCenterId(row.centerId());
            sample.setMealId(row.mealId());
            sample.setCheckoutPrice(row.checkoutPrice());
            sample.setBasePrice(row.basePrice());
            sample.setEmailerForPromotion(row.emailerForPromotion());
            sample.setHomepageFeatured(row.homepageFeatured());
            samples.add(sample);
        }
        request.setSamples(samples);

        MlPredictResponse predictionResponse;
        try {
            predictionResponse = webClient.post()
                    .uri("/predict")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(MlPredictResponse.class)
                    .block();
        } catch (Exception e) {
            throw new ResponseStatusException(502, "ML API call failed: " + e.getMessage(), e);
        }

        List<MlPrediction> predictions = predictionResponse == null || predictionResponse.getPredictions() == null
                ? List.of()
                : predictionResponse.getPredictions();

        Map<Long, Double> predictedByMealId = new HashMap<>();
        for (MlPrediction prediction : predictions) {
            if (prediction.getMealId() != null && prediction.getPredictedOrders() != null) {
                predictedByMealId.put(prediction.getMealId(), prediction.getPredictedOrders());
            }
        }

        List<ModelVsActualPoint> points = new ArrayList<>();
        double absErrSum = 0.0;
        double absPctErrSum = 0.0;
        int countForMape = 0;

        for (TrainSampleRow row : rows) {
            double predicted = predictedByMealId.getOrDefault(row.mealId(), 0.0);
            double actual = row.actualOrders();
            double absErr = Math.abs(actual - predicted);
            absErrSum += absErr;
            if (actual > 0.0) {
                absPctErrSum += absErr / actual;
                countForMape++;
            }

            points.add(new ModelVsActualPoint(row.mealId(), row.week(), actual, predicted));
        }

        double mae = points.isEmpty() ? 0.0 : absErrSum / points.size();
        double mape = countForMape == 0 ? 0.0 : (absPctErrSum / countForMape) * 100.0;

        return new ModelVsActualResponse(points.size(), mae, mape, points);
    }

    private List<TrainSampleRow> loadTrainSamples(int limit) {
        ClassPathResource resource = new ClassPathResource("train.csv");
        List<TrainSampleRow> rows = new ArrayList<>();
        Set<Long> seenMealIds = new HashSet<>();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8));
             CSVParser parser = CSVFormat.DEFAULT.withFirstRecordAsHeader().parse(reader)) {

            for (CSVRecord record : parser) {
                long mealId = Long.parseLong(record.get("meal_id"));
                if (seenMealIds.contains(mealId)) {
                    continue;
                }
                seenMealIds.add(mealId);

                rows.add(new TrainSampleRow(
                        Long.parseLong(record.get("id")),
                        Integer.parseInt(record.get("week")),
                        Integer.parseInt(record.get("center_id")),
                        mealId,
                        Double.parseDouble(record.get("checkout_price")),
                        Double.parseDouble(record.get("base_price")),
                        Integer.parseInt(record.get("emailer_for_promotion")),
                        Integer.parseInt(record.get("homepage_featured")),
                        Double.parseDouble(record.get("num_orders"))
                ));

                if (rows.size() >= limit) {
                    break;
                }
            }
        } catch (Exception e) {
            throw new ResponseStatusException(500, "Failed to read train.csv: " + e.getMessage(), e);
        }

        return rows;
    }

    private record TrainSampleRow(
            Long id,
            Integer week,
            Integer centerId,
            Long mealId,
            Double checkoutPrice,
            Double basePrice,
            Integer emailerForPromotion,
            Integer homepageFeatured,
            Double actualOrders
    ) {
    }
}
