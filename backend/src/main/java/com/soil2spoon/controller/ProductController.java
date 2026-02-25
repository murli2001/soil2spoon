package com.soil2spoon.controller;

import com.soil2spoon.dto.ProductResponse;
import com.soil2spoon.dto.ReviewRequest;
import com.soil2spoon.dto.ReviewResponse;
import com.soil2spoon.service.ProductService;
import com.soil2spoon.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAll(
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(productService.findAll(category, pageable));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<ProductResponse>> getFeatured() {
        return ResponseEntity.ok(productService.findFeatured());
    }

    @GetMapping("/trending")
    public ResponseEntity<List<ProductResponse>> getTrending() {
        return ResponseEntity.ok(productService.findTrending());
    }

    @GetMapping("/{productId}/reviews")
    public ResponseEntity<List<ReviewResponse>> getReviews(
            @PathVariable Long productId,
            @AuthenticationPrincipal UserDetails userDetails) {
        String currentUserEmail = userDetails != null ? userDetails.getUsername() : null;
        return ResponseEntity.ok(reviewService.findByProductId(productId, currentUserEmail));
    }

    @PostMapping("/{productId}/reviews")
    public ResponseEntity<ReviewResponse> createReview(
            @PathVariable Long productId,
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null || userDetails.getUsername() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        ReviewResponse created = reviewService.create(productId, request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{productId}/reviews/{reviewId}")
    public ResponseEntity<?> updateReview(
            @PathVariable Long productId,
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null || userDetails.getUsername() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            ReviewResponse updated = reviewService.update(productId, reviewId, request, userDetails.getUsername());
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ProductResponse> getBySlug(@PathVariable String slug) {
        ProductResponse product = productService.findBySlug(slug);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(product);
    }
}
