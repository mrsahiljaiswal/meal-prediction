package com.luminescent.pos.repository;

import com.luminescent.pos.entity.OrderLineItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderLineItemRepository extends JpaRepository<OrderLineItem, Long> {
}
