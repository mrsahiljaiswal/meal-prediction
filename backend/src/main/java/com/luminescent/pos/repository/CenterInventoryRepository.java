package com.luminescent.pos.repository;

import com.luminescent.pos.entity.CenterInventory;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CenterInventoryRepository extends JpaRepository<CenterInventory, Long> {

    @EntityGraph(attributePaths = "ingredient")
    List<CenterInventory> findByCenterId(Long centerId);

    Optional<CenterInventory> findByCenterIdAndIngredient_Id(Long centerId, Long ingredientId);
}
