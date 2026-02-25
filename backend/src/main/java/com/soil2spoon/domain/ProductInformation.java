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
public class ProductInformation {

    @Column(name = "info_disclaimer", length = 2000)
    private String disclaimer;

    @Column(name = "info_customer_care", length = 1000)
    private String customerCareDetails;

    @Column(name = "info_seller_name", length = 200)
    private String sellerName;

    @Column(name = "info_seller_address", length = 1000)
    private String sellerAddress;

    @Column(name = "info_seller_license", length = 100)
    private String sellerLicenseNo;

    @Column(name = "info_manufacturer", length = 200)
    private String manufacturerName;

    @Column(name = "info_country_origin", length = 100)
    private String countryOfOrigin;

    @Column(name = "info_shelf_life", length = 100)
    private String shelfLife;
}
