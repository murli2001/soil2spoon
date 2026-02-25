package com.soil2spoon.dto;

import com.soil2spoon.domain.ProductInformation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductInformationResponse {

    private String disclaimer;
    private String customerCareDetails;
    private String sellerName;
    private String sellerAddress;
    private String sellerLicenseNo;
    private String manufacturerName;
    private String countryOfOrigin;
    private String shelfLife;

    public static ProductInformationResponse from(ProductInformation info) {
        if (info == null) return null;
        return ProductInformationResponse.builder()
                .disclaimer(info.getDisclaimer())
                .customerCareDetails(info.getCustomerCareDetails())
                .sellerName(info.getSellerName())
                .sellerAddress(info.getSellerAddress())
                .sellerLicenseNo(info.getSellerLicenseNo())
                .manufacturerName(info.getManufacturerName())
                .countryOfOrigin(info.getCountryOfOrigin())
                .shelfLife(info.getShelfLife())
                .build();
    }
}
