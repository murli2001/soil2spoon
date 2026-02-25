package com.soil2spoon.controller;

import com.soil2spoon.dto.ProductRequest;
import com.soil2spoon.dto.ProductResponse;
import com.soil2spoon.service.ProductService;
import com.soil2spoon.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductService productService;
    private final ReviewService reviewService;

    @PostMapping("/products")
    public ResponseEntity<?> createProduct(@RequestBody ProductRequest request) {
        try {
            ProductResponse created = productService.create(request);
            return ResponseEntity.status(201).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody ProductRequest request) {
        try {
            ProductResponse updated = productService.update(id, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/products/{productId}/reviews/{reviewId}")
    public ResponseEntity<?> deleteProductReview(@PathVariable Long productId, @PathVariable Long reviewId) {
        try {
            reviewService.deleteById(reviewId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
