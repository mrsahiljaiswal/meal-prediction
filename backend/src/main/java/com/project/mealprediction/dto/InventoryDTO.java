package com.project.mealprediction.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InventoryDTO {

    private Integer centerCode;
    private Long ingredientId;
    private Double availableStock;
}