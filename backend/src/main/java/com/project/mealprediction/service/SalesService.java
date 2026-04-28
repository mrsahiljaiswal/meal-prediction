package com.project.mealprediction.service;

import com.project.mealprediction.dto.SaleRequestDTO;
import com.project.mealprediction.entity.*;
import com.project.mealprediction.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.WeekFields;

@Service
@RequiredArgsConstructor
public class SalesService {

    private final CenterRepository centerRepository;
    private final MealRepository mealRepository;
    private final SalesTransactionRepository salesTransactionRepository;


    public String saveSale(SaleRequestDTO dto) {

        Center center = centerRepository.findByCenterCode(dto.getCenterCode())
                .orElseThrow(() -> new RuntimeException("Center not found"));

        Meal meal = mealRepository.findByMealCode(dto.getMealCode())
                .orElseThrow(() -> new RuntimeException("Meal not found"));

        SalesTransaction sale = new SalesTransaction();

        sale.setCenter(center);
        sale.setMeal(meal);
        sale.setQuantity(dto.getQuantity());
        sale.setCheckoutPrice(meal.getCheckoutPrice());
        sale.setBasePrice(meal.getBasePrice());
        sale.setEmailerForPromotion(dto.getEmailerForPromotion());
        sale.setHomepageFeatured(dto.getHomepageFeatured());
        sale.setCreatedAt(LocalDateTime.now());

        int week = LocalDate.now().get(WeekFields.ISO.weekOfWeekBasedYear());
        sale.setWeekNumber(week);

        salesTransactionRepository.save(sale);

        return "Sale saved successfully";
    }
}