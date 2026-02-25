package com.soil2spoon.dto;

import com.soil2spoon.domain.CartItem;
import com.soil2spoon.domain.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemResponse {

    private String id;       // product id (for frontend compatibility)
    private String name;
    private String slug;
    private Integer price;
    private String image;
    private String fallbackImage;
    private Integer quantity;

    public static CartItemResponse from(CartItem item) {
        if (item == null || item.getProduct() == null) return null;
        Product p = item.getProduct();
        return CartItemResponse.builder()
                .id(String.valueOf(p.getId()))
                .name(p.getName())
                .slug(p.getSlug())
                .price(p.getPrice())
                .image(p.getImage())
                .fallbackImage(p.getFallbackImage())
                .quantity(item.getQuantity())
                .build();
    }
}
