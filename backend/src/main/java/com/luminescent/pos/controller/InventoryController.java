package com.luminescent.pos.controller;

import com.luminescent.pos.dto.ModelVsActualResponse;
import com.luminescent.pos.dto.PredictedIngredientResponse;
import com.luminescent.pos.service.InventoryForecastService;
import com.luminescent.pos.service.ml.MlApiHealthResponse;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "http://localhost:5173")
public class InventoryController {

    private final InventoryForecastService inventoryForecastService;

    public InventoryController(InventoryForecastService inventoryForecastService) {
        this.inventoryForecastService = inventoryForecastService;
    }

    @GetMapping("/predict-next-week")
    public List<PredictedIngredientResponse> predictNextWeek() {
        return inventoryForecastService.predictNextWeekIngredientDemand();
    }

    @GetMapping("/ml-api-health")
    public MlApiHealthResponse mlApiHealth() {
        return inventoryForecastService.checkMlApi();
    }

    @GetMapping("/model-vs-actual")
    public ModelVsActualResponse modelVsActual(@RequestParam(defaultValue = "40") int limit) {
        return inventoryForecastService.getModelVsActual(limit);
    }
}
