package com.project.mealprediction.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "meals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private Integer mealCode;

    @Column(nullable = false)
    private String mealName;

    private Double basePrice;

    private Double checkoutPrice;

    private String category;
}