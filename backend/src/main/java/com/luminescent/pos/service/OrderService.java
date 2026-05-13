package com.luminescent.pos.service;

import com.luminescent.pos.dto.OrderRequest;
import com.luminescent.pos.dto.OrderResponse;
import com.luminescent.pos.entity.*;
import com.luminescent.pos.repository.CenterInventoryRepository;
import com.luminescent.pos.repository.CustomerOrderRepository;
import com.luminescent.pos.repository.MealIngredientMappingRepository;
import com.luminescent.pos.repository.MealRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final MealRepository mealRepository;
    private final MealIngredientMappingRepository mealIngredientMappingRepository;
    private final CustomerOrderRepository customerOrderRepository;
    private final CenterInventoryRepository centerInventoryRepository;

    public OrderService(MealRepository mealRepository,
                        MealIngredientMappingRepository mealIngredientMappingRepository,
                        CustomerOrderRepository customerOrderRepository,
                        CenterInventoryRepository centerInventoryRepository) {
        this.mealRepository = mealRepository;
        this.mealIngredientMappingRepository = mealIngredientMappingRepository;
        this.customerOrderRepository = customerOrderRepository;
        this.centerInventoryRepository = centerInventoryRepository;
    }


    @Transactional
    public OrderResponse placeOrder(OrderRequest request) {
        CustomerOrder order = new CustomerOrder();
        order.setTimestamp(LocalDateTime.now());
        order.setTotalAmount(0.0);

        List<OrderLineItem> lineItems = new ArrayList<>();
        double total = 0.0;

        for (OrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            Meal meal = mealRepository.findById(itemRequest.getMealId())
                    .orElseThrow(() -> new EntityNotFoundException("Meal not found: " + itemRequest.getMealId()));

            int quantity = itemRequest.getQuantity();
            total += meal.getCheckoutPrice() * quantity;

            OrderLineItem lineItem = new OrderLineItem();
            lineItem.setOrder(order);
            lineItem.setMeal(meal);
            lineItem.setQuantity(quantity);
            lineItems.add(lineItem);

            List<MealIngredientMapping> mappings = mealIngredientMappingRepository.findByMeal_Id(meal.getId());
            for (MealIngredientMapping mapping : mappings) {
                Ingredient ingredient = mapping.getIngredient();
                double consumed = mapping.getQuantityRequired() * quantity;
                double currentStock = ingredient.getCurrentStockQuantity() == null ? 0.0 : ingredient.getCurrentStockQuantity();
                double normalizedConsumption =
                        UnitConversionService.normalize(
                                mapping.getQuantityRequired(),
                                ingredient.getUnit()
                        ) * quantity;

                if(currentStock < normalizedConsumption){
                    throw new RuntimeException(
                            "Insufficient stock for ingredient: "
                                    + ingredient.getName()
                    );
                }

                ingredient.setCurrentStockQuantity(
                        currentStock - normalizedConsumption
                );
            }
        }

        order.setTotalAmount(total);
        order.setLineItems(lineItems);
        CustomerOrder saved = customerOrderRepository.save(order);
        return new OrderResponse(saved.getId(), saved.getTotalAmount());
    }

    @Transactional
    public OrderResponse processOrder(OrderRequest request) {
        if (request.getCenterId() == null) {
            throw new IllegalArgumentException("centerId is required");
        }

        CustomerOrder order = new CustomerOrder();
        order.setTimestamp(LocalDateTime.now());
        order.setTotalAmount(0.0);

        // Setting the new Center ID and Employee ID fields
        order.setCenterId(request.getCenterId());
        order.setEmpId(request.getEmpId());

        List<OrderLineItem> lineItems = new ArrayList<>();
        double total = 0.0;

        for (OrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            Meal meal = mealRepository.findById(itemRequest.getMealId())
                    .orElseThrow(() -> new EntityNotFoundException("Meal not found: " + itemRequest.getMealId()));

            if (meal.getCenterId() == null || !request.getCenterId().equals(meal.getCenterId().longValue())) {
                throw new IllegalArgumentException(
                        "Meal " + meal.getId() + " is not available for center " + request.getCenterId()
                );
            }

            int quantity = itemRequest.getQuantity();
            total += meal.getCheckoutPrice() * quantity;

            OrderLineItem lineItem = new OrderLineItem();
            lineItem.setOrder(order);
            lineItem.setMeal(meal);
            lineItem.setQuantity(quantity);
            lineItems.add(lineItem);

            // Deduct ingredients based on meal mappings
            List<MealIngredientMapping> mappings = mealIngredientMappingRepository.findByMeal_Id(meal.getId());
            for (MealIngredientMapping mapping : mappings) {
                Ingredient ingredient = mapping.getIngredient();
                CenterInventory centerInventory = centerInventoryRepository
                        .findByCenterIdAndIngredient_Id(request.getCenterId(), ingredient.getId())
                        .orElseThrow(() -> new EntityNotFoundException(
                                "No inventory found for center "
                                        + request.getCenterId()
                                        + " and ingredient "
                                        + ingredient.getName()
                        ));

                double consumed = UnitConversionService.normalize(
                        mapping.getQuantityRequired(),
                        ingredient.getUnit()
                ) * quantity;
                double currentStock = centerInventory.getCurrentStockQuantity() == null
                        ? 0.0
                        : centerInventory.getCurrentStockQuantity();

                if (currentStock < consumed) {
                    throw new RuntimeException(
                            "Insufficient stock for ingredient: " + ingredient.getName()
                    );
                }

                centerInventory.setCurrentStockQuantity(currentStock - consumed);
            }
        }

        order.setTotalAmount(total);
        order.setLineItems(lineItems);
        CustomerOrder saved = customerOrderRepository.save(order);

        return new OrderResponse(saved.getId(), saved.getTotalAmount());
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByCenterId(Long centerId) {
        // Fetches orders specific to the logged-in center
        List<CustomerOrder> orders = customerOrderRepository.findByCenterId(centerId);

        List<OrderResponse> responses = new ArrayList<>();
        for (CustomerOrder order : orders) {
            responses.add(new OrderResponse(order.getId(), order.getTotalAmount()));
        }

        return responses;
    }
}
