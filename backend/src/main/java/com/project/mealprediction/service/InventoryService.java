package com.project.mealprediction.service;

import com.project.mealprediction.dto.InventoryDTO;
import com.project.mealprediction.entity.*;
import com.project.mealprediction.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final CenterRepository centerRepository;
    private final IngredientRepository ingredientRepository;
    private final InventoryRepository inventoryRepository;

    public String saveInventory(InventoryDTO dto) {

        Center center = centerRepository.findByCenterCode(dto.getCenterCode())
                .orElseThrow();

        Ingredient ingredient = ingredientRepository.findById(dto.getIngredientId())
                .orElseThrow();

        Inventory inventory = new Inventory();
        inventory.setCenter(center);
        inventory.setIngredient(ingredient);
        inventory.setAvailableStock(dto.getAvailableStock());

        inventoryRepository.save(inventory);

        return "Inventory saved";
    }
}