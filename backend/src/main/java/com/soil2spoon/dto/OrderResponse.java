package com.soil2spoon.dto;

import com.soil2spoon.domain.Order;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private String id;
    private String orderDate;
    private Integer totalAmount;
    private String status;
    private List<OrderItemResponse> items;
    private String shippingName;
    private String shippingPhone;
    private String shippingAddressLine1;
    private String shippingAddressLine2;
    private String shippingCity;
    private String shippingState;
    private String shippingPincode;
    private String paymentMethod;

    public static OrderResponse from(Order order) {
        if (order == null) return null;
        List<OrderItemResponse> items = order.getItems() == null
                ? List.of()
                : order.getItems().stream()
                        .map(OrderItemResponse::from)
                        .collect(Collectors.toList());
        return OrderResponse.builder()
                .id(String.valueOf(order.getId()))
                .orderDate(order.getOrderDate() != null ? order.getOrderDate().toString() : null)
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus() != null ? order.getStatus().name() : null)
                .items(items)
                .shippingName(order.getShippingName())
                .shippingPhone(order.getShippingPhone())
                .shippingAddressLine1(order.getShippingAddressLine1())
                .shippingAddressLine2(order.getShippingAddressLine2())
                .shippingCity(order.getShippingCity())
                .shippingState(order.getShippingState())
                .shippingPincode(order.getShippingPincode())
                .paymentMethod(order.getPaymentMethod())
                .build();
    }
}
