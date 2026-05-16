package com.luminescent.pos.repository;

import com.luminescent.pos.entity.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {
    // Custom method to support the new dashboard logic
    List<CustomerOrder> findByCenterId(Long centerId);
}