package com.soil2spoon.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {

    /** Delivery / shipping address (optional; can be filled on checkout). */
    private String shippingName;
    private String shippingPhone;
    private String shippingAddressLine1;
    private String shippingAddressLine2;
    private String shippingCity;
    private String shippingState;
    private String shippingPincode;

    /** Selected payment method (e.g. COD, CARD, UPI). For display only; no processing. */
    private String paymentMethod;
}
