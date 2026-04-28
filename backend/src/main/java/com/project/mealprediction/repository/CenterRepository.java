package com.project.mealprediction.repository;

import com.project.mealprediction.entity.Center;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CenterRepository extends JpaRepository<Center, Long> {
    Optional<Center> findByCenterCode(Integer centerCode);
}