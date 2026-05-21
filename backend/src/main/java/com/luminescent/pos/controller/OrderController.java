package com.luminescent.pos.controller;

import com.luminescent.pos.dto.OrderRequest;
import com.luminescent.pos.dto.OrderResponse;
import com.luminescent.pos.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(@RequestBody OrderRequest request) {
        // Saving order with center_id and emp_id
        OrderResponse response = orderService.processOrder(request);
        return ResponseEntity.ok(response);
    }

    // New endpoint to fetch strictly center-specific dashboard data
    @GetMapping("/center/{centerId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByCenter(@PathVariable Long centerId) {
        List<OrderResponse> orders = orderService.getOrdersByCenterId(centerId);
        return ResponseEntity.ok(orders);
    }
}