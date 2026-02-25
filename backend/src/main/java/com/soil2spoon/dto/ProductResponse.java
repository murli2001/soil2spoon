package com.soil2spoon.dto;

import com.soil2spoon.domain.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {

    private String id;
    private String name;
    private String slug;
    private Integer price;
    private Integer originalPrice;
    private String category;
    private Double rating;
    private Integer reviewCount;
    private String netQty;
    private String image;
    private List<String> images;
    private String fallbackImage;
    private String description;
    private Boolean featured;
    private Boolean trending;
    private ProductHighlightsResponse highlights;
    private ProductInformationResponse information;

    public static ProductResponse from(Product p) {
        if (p == null) return null;
        return ProductResponse.builder()
                .id(String.valueOf(p.getId()))
                .name(p.getName())
                .slug(p.getSlug())
                .price(p.getPrice())
                .originalPrice(p.getOriginalPrice())
                .category(p.getCategory() != null ? p.getCategory().getId() : null)
                .rating(p.getRating())
                .reviewCount(p.getReviewCount())
                .netQty(p.getNetQty())
                .image(p.getImage())
                .images(p.getImages() != null ? List.copyOf(p.getImages()) : List.of())
                .fallbackImage(p.getFallbackImage())
                .description(p.getDescription())
                .featured(p.getFeatured())
                .trending(p.getTrending())
                .highlights(ProductHighlightsResponse.from(p.getHighlights()))
                .information(ProductInformationResponse.from(p.getInformation()))
                .build();
    }
}
