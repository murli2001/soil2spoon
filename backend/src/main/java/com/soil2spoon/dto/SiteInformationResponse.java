package com.soil2spoon.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteInformationResponse {

    private String disclaimer;
    private String customerCareDetails;
    private String sellerName;
    private String sellerAddress;
    private String sellerLicenseNo;
    private String manufacturerName;
    private String countryOfOrigin;
    private String shelfLife;
}
