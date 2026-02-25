package com.soil2spoon.controller;

import com.soil2spoon.dto.CreateOrderRequest;
import com.soil2spoon.dto.OrderResponse;
import com.soil2spoon.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<?> createOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody(required = false) CreateOrderRequest body) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            OrderResponse order = orderService.createOrder(userDetails.getUsername(), body != null ? body : new CreateOrderRequest());
            return ResponseEntity.status(201).body(order);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrders(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(orderService.getOrders(userDetails.getUsername()));
    }
}
