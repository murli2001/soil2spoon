package com.soil2spoon.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {

    private String name;
    private String slug;
    private Integer price;
    private Integer originalPrice;
    private String categoryId;
    private Double rating;
    private Integer reviewCount;
    private String netQty;
    private String image;
    private List<String> images;
    private String fallbackImage;
    private String description;
    private Boolean featured;
    private Boolean trending;
    private ProductHighlightsRequest highlights;
    private ProductInformationRequest information;
}
