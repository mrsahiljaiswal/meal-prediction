package com.luminescent.pos.repository;

import com.luminescent.pos.entity.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {
}
