package com.soil2spoon.dto;

import com.soil2spoon.domain.UserAddress;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressResponse {

    private Long id;
    private String name;
    private String phone;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String pincode;
    private Boolean isDefault;

    public static AddressResponse from(UserAddress a) {
        if (a == null) return null;
        return AddressResponse.builder()
                .id(a.getId())
                .name(a.getName())
                .phone(a.getPhone())
                .addressLine1(a.getAddressLine1())
                .addressLine2(a.getAddressLine2())
                .city(a.getCity())
                .state(a.getState())
                .pincode(a.getPincode())
                .isDefault(Boolean.TRUE.equals(a.getIsDefault()))
                .build();
    }
}
