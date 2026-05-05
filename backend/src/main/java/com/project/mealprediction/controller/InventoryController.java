package com.project.mealprediction.controller;

import com.project.mealprediction.dto.InventoryDTO;
import com.project.mealprediction.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @PostMapping
    public String saveInventory(@RequestBody InventoryDTO dto) {
        return inventoryService.saveInventory(dto);
    }
}