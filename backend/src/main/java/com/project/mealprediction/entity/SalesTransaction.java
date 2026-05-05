package com.project.mealprediction.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "sales_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SalesTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "center_id", nullable = false)
    private Center center;

    @ManyToOne
    @JoinColumn(name = "meal_id", nullable = false)
    private Meal meal;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Double checkoutPrice;

    @Column(nullable = false)
    private Double basePrice;

    private Boolean emailerForPromotion;

    private Boolean homepageFeatured;

    private LocalDateTime createdAt;

    @Column(nullable = false)
    private Integer weekNumber;
}
