package com.soil2spoon.controller;

import com.soil2spoon.dto.CartItemRequest;
import com.soil2spoon.dto.CartItemResponse;
import com.soil2spoon.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItemResponse>> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(cartService.getCart(userDetails.getUsername()));
    }

    @PutMapping
    public ResponseEntity<List<CartItemResponse>> setCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody List<CartItemRequest> items) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(cartService.setCart(userDetails.getUsername(), items));
    }
}
