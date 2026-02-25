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
public class ShippingPolicyResponse {

    private String title;
    private String intro;
    private Integer freeOver;
    private Integer flatCharge;
    private String deliveryDays;
    private List<ShippingZoneResponse> zones;
    private String note;
}
