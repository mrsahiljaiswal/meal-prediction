package com.luminescent.pos.repository;

import com.luminescent.pos.entity.Meal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MealRepository extends JpaRepository<Meal, Long> {
    Optional<Meal> findFirstByOrderByIdAsc();
}
