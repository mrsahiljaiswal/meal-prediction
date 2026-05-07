package com.luminescent.pos.controller;

import com.luminescent.pos.dto.OrderRequest;
import com.luminescent.pos.dto.OrderResponse;
import com.luminescent.pos.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public OrderResponse placeOrder(@Valid @RequestBody OrderRequest request) {
        return orderService.placeOrder(request);
    }
}
