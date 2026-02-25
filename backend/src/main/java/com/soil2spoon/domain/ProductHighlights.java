package com.soil2spoon.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductHighlights {

    @Column(length = 100)
    private String brand;

    @Column(length = 50)
    private String productType;

    @Column(length = 50)
    private String dietaryPreference;

    @Column(length = 500)
    private String keyFeatures;

    @Column(length = 100)
    private String flavour;

    @Column(length = 500)
    private String ingredients;

    @Column(length = 500)
    private String allergenInformation;

    @Column(length = 50)
    private String weight;

    @Column(length = 100)
    private String unit;

    @Column(length = 50)
    private String packagingType;
}
