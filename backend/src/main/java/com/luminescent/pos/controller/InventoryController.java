package com.luminescent.pos.controller;

import com.luminescent.pos.dto.CenterInventoryResponse;
import com.luminescent.pos.dto.BaselineSalesResponse;
import com.luminescent.pos.dto.ModelMetricsResponse;
import com.luminescent.pos.dto.ModelVsActualResponse;
import com.luminescent.pos.dto.PredictedIngredientResponse;
import com.luminescent.pos.entity.CenterInventory;
import com.luminescent.pos.repository.CenterInventoryRepository;
import com.luminescent.pos.service.InventoryForecastService;
import com.luminescent.pos.service.ml.MlApiHealthResponse;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class InventoryController {

    private final InventoryForecastService inventoryForecastService;
    private final CenterInventoryRepository centerInventoryRepository;

    public InventoryController(
            InventoryForecastService inventoryForecastService,
            CenterInventoryRepository centerInventoryRepository
    ) {
        this.inventoryForecastService = inventoryForecastService;
        this.centerInventoryRepository = centerInventoryRepository;
    }

    @GetMapping("/predict-next-week")
    public List<PredictedIngredientResponse> predictNextWeek(
            @RequestParam(required = true) Long centerId
    ) {
        return inventoryForecastService.predictNextWeekIngredientDemand(centerId);
    }

    @GetMapping("/ml-api-health")
    public MlApiHealthResponse mlApiHealth() {
        return inventoryForecastService.checkMlApi();
    }

    @GetMapping("/center/{centerId}")
    public List<CenterInventoryResponse> getCenterInventory(@PathVariable Long centerId) {
        return centerInventoryRepository.findByCenterId(centerId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @GetMapping("/model-vs-actual")
    public ModelVsActualResponse modelVsActual(
            @RequestParam(defaultValue = "40") int limit,
            @RequestParam(required = false) Long centerId
    ) {
        return inventoryForecastService.getModelVsActual(limit, centerId);
    }

    @GetMapping("/model-metrics")
    public ModelMetricsResponse modelMetrics() {
        return inventoryForecastService.getModelMetrics();
    }

    @GetMapping("/baseline-sales/{centerId}")
    public BaselineSalesResponse baselineSales(@PathVariable Long centerId) {
        return inventoryForecastService.getBaselineSales(centerId);
    }

    private CenterInventoryResponse toResponse(CenterInventory inventory) {
        return new CenterInventoryResponse(
                inventory.getIngredient().getId(),
                inventory.getIngredient().getName(),
                inventory.getIngredient().getUnit().name(),
                inventory.getCurrentStockQuantity()
        );
    }
}
