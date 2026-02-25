package com.soil2spoon.dto;

import com.soil2spoon.domain.ProductHighlights;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductHighlightsResponse {

    private String brand;
    private String productType;
    private String dietaryPreference;
    private String keyFeatures;
    private String flavour;
    private String ingredients;
    private String allergenInformation;
    private String weight;
    private String unit;
    private String packagingType;

    public static ProductHighlightsResponse from(ProductHighlights h) {
        if (h == null) return null;
        return ProductHighlightsResponse.builder()
                .brand(h.getBrand())
                .productType(h.getProductType())
                .dietaryPreference(h.getDietaryPreference())
                .keyFeatures(h.getKeyFeatures())
                .flavour(h.getFlavour())
                .ingredients(h.getIngredients())
                .allergenInformation(h.getAllergenInformation())
                .weight(h.getWeight())
                .unit(h.getUnit())
                .packagingType(h.getPackagingType())
                .build();
    }
}
