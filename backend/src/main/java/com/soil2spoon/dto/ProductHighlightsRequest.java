package com.soil2spoon.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductHighlightsRequest {

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
}
