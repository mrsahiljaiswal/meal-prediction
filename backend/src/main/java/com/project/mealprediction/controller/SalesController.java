package com.project.mealprediction.controller;

import com.project.mealprediction.dto.SaleRequestDTO;
import com.project.mealprediction.service.SalesService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
public class SalesController {

    private final SalesService salesService;
    @PostMapping
    public String saveSale(@RequestBody SaleRequestDTO dto) {
        return salesService.saveSale(dto);
    }
}
