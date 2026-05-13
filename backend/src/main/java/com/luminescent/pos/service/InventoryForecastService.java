package com.luminescent.pos.service;

import com.luminescent.pos.dto.ModelVsActualPoint;
import com.luminescent.pos.dto.ModelVsActualResponse;
import com.luminescent.pos.dto.PredictedIngredientResponse;
import com.luminescent.pos.entity.CenterInventory;
import com.luminescent.pos.entity.Ingredient;
import com.luminescent.pos.entity.Meal;
import com.luminescent.pos.entity.MealRecipe;
import com.luminescent.pos.repository.CenterInventoryRepository;
import com.luminescent.pos.repository.MealRecipeRepository;
import com.luminescent.pos.repository.MealRepository;
import com.luminescent.pos.service.ml.MlApiHealthResponse;
import com.luminescent.pos.service.ml.MlPredictRequest;
import com.luminescent.pos.service.ml.MlPredictResponse;
import com.luminescent.pos.service.ml.MlPredictSample;
import com.luminescent.pos.service.ml.MlPrediction;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.server.ResponseStatusException;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class InventoryForecastService {

    private static final Logger logger =
            LoggerFactory.getLogger(InventoryForecastService.class);

    private final MealRepository mealRepository;

    private final MealRecipeRepository mealRecipeRepository;

    private final CenterInventoryRepository centerInventoryRepository;

    private final WebClient webClient;

    public InventoryForecastService(
            MealRepository mealRepository,
            MealRecipeRepository mealRecipeRepository,
            CenterInventoryRepository centerInventoryRepository,
            WebClient webClient
    ) {

        this.mealRepository = mealRepository;
        this.mealRecipeRepository = mealRecipeRepository;
        this.centerInventoryRepository = centerInventoryRepository;
        this.webClient = webClient;
    }

    public List<PredictedIngredientResponse>
    predictNextWeekIngredientDemand() {
        return predictNextWeekIngredientDemand(null);
    }

    public List<PredictedIngredientResponse>
    predictNextWeekIngredientDemand(Long centerId) {

        List<Meal> meals = centerId == null
                ? mealRepository.findAll()
                : mealRepository.findByCenterId(centerId.intValue());

        if (meals.isEmpty()) {
            return List.of();
        }

        int week = LocalDate.now()
                .plusDays(7)
                .get(WeekFields.ISO.weekOfWeekBasedYear());

        MlPredictRequest request =
                new MlPredictRequest();

        List<MlPredictSample> samples =
                new ArrayList<>();

        for (int i = 0; i < meals.size(); i++) {

            samples.add(
                    createSample(
                            meals.get(i),
                            week,
                            i + 1L
                    )
            );
        }

        request.setSamples(samples);

        MlPredictResponse predictionResponse;

        try {

            logger.info(
                    "Sending ML payload with {} samples",
                    samples.size()
            );

            predictionResponse = webClient.post()
                    .uri("/predict")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(MlPredictResponse.class)
                    .block();

        } catch (WebClientResponseException e) {

            logger.error(
                    "ML API returned HTTP {} : {}",
                    e.getStatusCode(),
                    e.getResponseBodyAsString()
            );

            throw new ResponseStatusException(
                    502,
                    "ML API returned " + e.getStatusCode(),
                    e
            );

        } catch (Exception e) {

            logger.error(
                    "ML API call failed",
                    e
            );

            throw new ResponseStatusException(
                    502,
                    "ML API call failed: " + e.getMessage(),
                    e
            );
        }

        List<MlPrediction> predictions =
                predictionResponse == null
                        || predictionResponse.getPredictions() == null
                        ? List.of()
                        : predictionResponse.getPredictions();

        /*
         * centerId_mealId_week
         */
        Map<String, Double> predictedOrdersMap =
                new HashMap<>();

        for (int i = 0; i < predictions.size(); i++) {

            MlPrediction prediction =
                    predictions.get(i);

            MlPredictSample sample =
                    samples.get(i);

            if (
                    prediction.getMealId() != null
                            && prediction.getPredictedOrders() != null
            ) {

                String key =
                        sample.getCenterId()
                                + "_"
                                + prediction.getMealId()
                                + "_"
                                + sample.getWeek();

                predictedOrdersMap.put(
                        key,
                        prediction.getPredictedOrders()
                );
            }
        }

        List<Long> mealIds =
                meals.stream()
                        .map(Meal::getId)
                        .toList();

        List<MealRecipe> recipes =
                mealRecipeRepository.findByMeal_IdIn(mealIds);

        Map<Long, Double> predictedByIngredientId =
                new HashMap<>();

        Map<Long, Ingredient> ingredientById =
                new HashMap<>();

        for (MealRecipe recipe : recipes) {

            Meal meal = recipe.getMeal();

            String key =
                    meal.getCenterId()
                            + "_"
                            + meal.getId()
                            + "_"
                            + week;

            double predictedOrders =
                    predictedOrdersMap.getOrDefault(
                            key,
                            0.0
                    );

            double wastage =
                    recipe.getWastagePercentage() == null
                            ? 0.0
                            : recipe.getWastagePercentage() / 100.0;

            double normalizedQuantity =
                    UnitConversionService.normalize(
                            recipe.getQuantityRequired(),
                            recipe.getUnit()
                    );

            double requiredAmount =
                    predictedOrders
                            * normalizedQuantity
                            * (1 + wastage);

            long ingredientId =
                    recipe.getIngredient().getId();

            predictedByIngredientId.merge(
                    ingredientId,
                    requiredAmount,
                    Double::sum
            );

            ingredientById.put(
                    ingredientId,
                    recipe.getIngredient()
            );
        }

        List<PredictedIngredientResponse> responses =
                new ArrayList<>();

        for (Map.Entry<Long, Double> entry
                : predictedByIngredientId.entrySet()) {

            Ingredient ingredient =
                    ingredientById.get(entry.getKey());

            double predictedRequired =
                    entry.getValue();

            double currentStock =
                    centerId == null
                            ? (ingredient.getCurrentStockQuantity() == null
                            ? 0.0
                            : ingredient.getCurrentStockQuantity())
                            : centerInventoryRepository
                            .findByCenterIdAndIngredient_Id(centerId, ingredient.getId())
                            .map(CenterInventory::getCurrentStockQuantity)
                            .orElse(0.0);

            double amountToOrder =
                    Math.max(
                            0.0,
                            predictedRequired - currentStock
                    );

            responses.add(
                    new PredictedIngredientResponse(
                            ingredient.getName(),
                            predictedRequired,
                            currentStock,
                            amountToOrder
                    )
            );
        }

        return responses;
    }

    public MlApiHealthResponse checkMlApi() {

        Meal meal =
                mealRepository
                        .findFirstByOrderByIdAsc()
                        .orElse(null);

        if (meal == null) {

            return MlApiHealthResponse.error(
                    "No meals found"
            );
        }

        int week = LocalDate.now()
                .plusDays(7)
                .get(WeekFields.ISO.weekOfWeekBasedYear());

        MlPredictRequest request =
                new MlPredictRequest();

        request.setSamples(
                List.of(
                        createSample(
                                meal,
                                week,
                                1L
                        )
                )
        );

        try {

            MlPredictResponse response =
                    webClient.post()
                            .uri("/predict")
                            .contentType(MediaType.APPLICATION_JSON)
                            .bodyValue(request)
                            .retrieve()
                            .bodyToMono(MlPredictResponse.class)
                            .block();

            int count =
                    response == null
                            || response.getPredictions() == null
                            ? 0
                            : response.getPredictions().size();

            return MlApiHealthResponse.ok(count);

        } catch (Exception e) {

            logger.error(
                    "ML health check failed",
                    e
            );

            return MlApiHealthResponse.error(
                    e.getMessage()
            );
        }
    }

    private MlPredictSample createSample(
            Meal meal,
            int week,
            long sampleId
    ) {

        MlPredictSample sample =
                new MlPredictSample();

        sample.setId(sampleId);

        sample.setWeek(week);

        sample.setCenterId(meal.getCenterId());

        sample.setMealId(meal.getId());

        sample.setCheckoutPrice(
                meal.getCheckoutPrice() == null
                        ? 0.0
                        : meal.getCheckoutPrice()
        );

        sample.setBasePrice(
                meal.getBasePrice() == null
                        ? 0.0
                        : meal.getBasePrice()
        );

        sample.setEmailerForPromotion(
                meal.getEmailerForPromotion() == null
                        ? 0
                        : meal.getEmailerForPromotion()
        );

        sample.setHomepageFeatured(
                meal.getHomepageFeatured() == null
                        ? 0
                        : meal.getHomepageFeatured()
        );

        return sample;
    }

    public ModelVsActualResponse
    getModelVsActual(int limit) {
        return getModelVsActual(limit, null);
    }

    public ModelVsActualResponse
    getModelVsActual(int limit, Long centerId) {

        int safeLimit =
                Math.max(5, Math.min(limit, 300));

        List<TrainSampleRow> rows =
                loadTrainSamples(safeLimit, centerId);

        if (rows.isEmpty()) {

            return new ModelVsActualResponse(
                    0,
                    0,
                    0,
                    List.of()
            );
        }

        MlPredictRequest request =
                new MlPredictRequest();

        List<MlPredictSample> samples =
                new ArrayList<>();

        for (TrainSampleRow row : rows) {

            MlPredictSample sample =
                    new MlPredictSample();

            sample.setId(row.id());

            sample.setWeek(row.week());

            sample.setCenterId(row.centerId());

            sample.setMealId(row.mealId());

            sample.setCheckoutPrice(
                    row.checkoutPrice()
            );

            sample.setBasePrice(
                    row.basePrice()
            );

            sample.setEmailerForPromotion(
                    row.emailerForPromotion()
            );

            sample.setHomepageFeatured(
                    row.homepageFeatured()
            );

            samples.add(sample);
        }

        request.setSamples(samples);

        MlPredictResponse predictionResponse;

        try {

            predictionResponse =
                    webClient.post()
                            .uri("/predict")
                            .bodyValue(request)
                            .retrieve()
                            .bodyToMono(MlPredictResponse.class)
                            .block();

        } catch (Exception e) {

            throw new ResponseStatusException(
                    502,
                    "ML API call failed",
                    e
            );
        }

        List<MlPrediction> predictions =
                predictionResponse == null
                        || predictionResponse.getPredictions() == null
                        ? List.of()
                        : predictionResponse.getPredictions();

        Map<String, Double> predictedMap =
                new HashMap<>();

        for (int i = 0; i < predictions.size(); i++) {

            MlPrediction prediction =
                    predictions.get(i);

            TrainSampleRow row =
                    rows.get(i);

            String key =
                    row.centerId()
                            + "_"
                            + row.mealId()
                            + "_"
                            + row.week();

            predictedMap.put(
                    key,
                    prediction.getPredictedOrders()
            );
        }

        List<ModelVsActualPoint> points =
                new ArrayList<>();

        double absErrSum = 0.0;

        double absPctErrSum = 0.0;

        int countForMape = 0;

        for (TrainSampleRow row : rows) {

            String key =
                    row.centerId()
                            + "_"
                            + row.mealId()
                            + "_"
                            + row.week();

            double predicted =
                    predictedMap.getOrDefault(
                            key,
                            0.0
                    );

            double actual =
                    row.actualOrders();

            double absErr =
                    Math.abs(actual - predicted);

            absErrSum += absErr;

            if (actual > 0) {

                absPctErrSum += absErr / actual;

                countForMape++;
            }

            points.add(
                    new ModelVsActualPoint(
                            row.mealId(),
                            row.week(),
                            actual,
                            predicted
                    )
            );
        }

        double mae =
                absErrSum / points.size();

        double mape =
                countForMape == 0
                        ? 0.0
                        : (absPctErrSum / countForMape) * 100.0;

        return new ModelVsActualResponse(
                points.size(),
                mae,
                mape,
                points
        );
    }

    private List<TrainSampleRow>
    loadTrainSamples(int limit, Long centerId) {

        ClassPathResource resource =
                new ClassPathResource("train.csv");

        List<TrainSampleRow> rows =
                new ArrayList<>();

        try (

                BufferedReader reader =
                        new BufferedReader(
                                new InputStreamReader(
                                        resource.getInputStream(),
                                        StandardCharsets.UTF_8
                                )
                        );

                CSVParser parser =
                        CSVFormat.DEFAULT
                                .withFirstRecordAsHeader()
                                .parse(reader)

        ) {

            for (CSVRecord record : parser) {
                int rowCenterId =
                        Integer.parseInt(
                                record.get("center_id")
                        );

                if (centerId != null && !centerId.equals((long) rowCenterId)) {
                    continue;
                }

                rows.add(
                        new TrainSampleRow(

                                Long.parseLong(
                                        record.get("id")
                                ),

                                Integer.parseInt(
                                        record.get("week")
                                ),

                                rowCenterId,

                                Long.parseLong(
                                        record.get("meal_id")
                                ),

                                Double.parseDouble(
                                        record.get("checkout_price")
                                ),

                                Double.parseDouble(
                                        record.get("base_price")
                                ),

                                Integer.parseInt(
                                        record.get("emailer_for_promotion")
                                ),

                                Integer.parseInt(
                                        record.get("homepage_featured")
                                ),

                                Double.parseDouble(
                                        record.get("num_orders")
                                )
                        )
                );

                if (rows.size() >= limit) {
                    break;
                }
            }

        } catch (Exception e) {

            throw new ResponseStatusException(
                    500,
                    "Failed to read train.csv",
                    e
            );
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
