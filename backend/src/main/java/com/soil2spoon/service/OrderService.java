package com.soil2spoon.service;

import com.soil2spoon.domain.CartItem;
import com.soil2spoon.domain.Order;
import com.soil2spoon.domain.OrderItem;
import com.soil2spoon.domain.Order.OrderStatus;
import com.soil2spoon.domain.User;
import com.soil2spoon.dto.CreateOrderRequest;
import com.soil2spoon.dto.OrderResponse;
import com.soil2spoon.repository.CartItemRepository;
import com.soil2spoon.repository.OrderRepository;
import com.soil2spoon.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final AddressService addressService;

    @Transactional
    public OrderResponse createOrder(String userEmail, CreateOrderRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        List<CartItem> cartItems = cartItemRepository.findByUserIdOrderByIdAsc(user.getId());
        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }
        if (request == null || !hasShippingData(request)) {
            throw new IllegalArgumentException("Shipping address is required");
        }
        addressService.validateShippingAddress(
                request.getShippingName(),
                request.getShippingPhone(),
                request.getShippingAddressLine1(),
                request.getShippingAddressLine2(),
                request.getShippingCity(),
                request.getShippingState(),
                request.getShippingPincode()
        );
        int totalAmount = 0;
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem ci : cartItems) {
            int price = ci.getProduct().getPrice();
            int qty = ci.getQuantity();
            totalAmount += price * qty;
            orderItems.add(OrderItem.builder()
                    .product(ci.getProduct())
                    .quantity(qty)
                    .priceAtOrder(price)
                    .build());
        }
        Order order = Order.builder()
                .user(user)
                .orderDate(Instant.now())
                .totalAmount(totalAmount)
                .status(OrderStatus.PENDING)
                .shippingName(request != null ? request.getShippingName() : null)
                .shippingPhone(request != null ? request.getShippingPhone() : null)
                .shippingAddressLine1(request != null ? request.getShippingAddressLine1() : null)
                .shippingAddressLine2(request != null ? request.getShippingAddressLine2() : null)
                .shippingCity(request != null ? request.getShippingCity() : null)
                .shippingState(request != null ? request.getShippingState() : null)
                .shippingPincode(request != null ? request.getShippingPincode() : null)
                .paymentMethod(request != null ? request.getPaymentMethod() : null)
                .build();
        order = orderRepository.save(order);
        for (OrderItem oi : orderItems) {
            oi.setOrder(order);
        }
        order.getItems().addAll(orderItems);
        orderRepository.save(order);
        cartItemRepository.deleteByUserId(user.getId());
        return OrderResponse.from(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return orderRepository.findByUserIdOrderByOrderDateDesc(user.getId()).stream()
                .map(OrderResponse::from)
                .collect(Collectors.toList());
    }

    private boolean hasShippingData(CreateOrderRequest r) {
        return r != null
                && isNotBlank(r.getShippingName())
                && isNotBlank(r.getShippingPhone())
                && isNotBlank(r.getShippingAddressLine1())
                && isNotBlank(r.getShippingCity())
                && isNotBlank(r.getShippingState())
                && isNotBlank(r.getShippingPincode());
    }

    private boolean isNotBlank(String s) {
        return s != null && !s.isBlank();
    }
}
