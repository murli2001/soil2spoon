package com.soil2spoon.dto;

import com.soil2spoon.domain.OrderItem;
import com.soil2spoon.domain.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {

    private String productId;
    private String name;
    private String slug;
    private Integer price;
    private Integer quantity;

    public static OrderItemResponse from(OrderItem item) {
        if (item == null || item.getProduct() == null) return null;
        Product p = item.getProduct();
        return OrderItemResponse.builder()
                .productId(String.valueOf(p.getId()))
                .name(p.getName())
                .slug(p.getSlug())
                .price(item.getPriceAtOrder())
                .quantity(item.getQuantity())
                .build();
    }
}
