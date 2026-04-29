package com.project.mealprediction.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SaleRequestDTO {

    private Integer centerCode;
    private Integer mealCode;
    private Integer quantity;
    private Boolean emailerForPromotion;
    private Boolean homepageFeatured;
}