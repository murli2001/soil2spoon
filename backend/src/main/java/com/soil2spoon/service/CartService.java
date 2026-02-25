package com.soil2spoon.service;

import com.soil2spoon.domain.CartItem;
import com.soil2spoon.domain.Product;
import com.soil2spoon.domain.User;
import com.soil2spoon.dto.CartItemRequest;
import com.soil2spoon.dto.CartItemResponse;
import com.soil2spoon.repository.CartItemRepository;
import com.soil2spoon.repository.ProductRepository;
import com.soil2spoon.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<CartItemResponse> getCart(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return cartItemRepository.findByUserIdOrderByIdAsc(user.getId()).stream()
                .map(CartItemResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<CartItemResponse> setCart(String userEmail, List<CartItemRequest> items) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        cartItemRepository.deleteByUserId(user.getId());
        if (items == null || items.isEmpty()) {
            return List.of();
        }
        List<Long> productIds = items.stream()
                .map(CartItemRequest::getProductId)
                .distinct()
                .toList();
        Map<Long, Product> products = productRepository.findAllById(productIds).stream()
                .collect(Collectors.toMap(Product::getId, p -> p));
        List<CartItem> toSave = new ArrayList<>();
        for (CartItemRequest req : items) {
            if (req.getQuantity() < 1) continue;
            Product product = products.get(req.getProductId());
            if (product == null) continue;
            toSave.add(CartItem.builder()
                    .user(user)
                    .product(product)
                    .quantity(req.getQuantity())
                    .build());
        }
        cartItemRepository.saveAll(toSave);
        return cartItemRepository.findByUserIdOrderByIdAsc(user.getId()).stream()
                .map(CartItemResponse::from)
                .collect(Collectors.toList());
    }
}
