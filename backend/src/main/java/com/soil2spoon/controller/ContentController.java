package com.soil2spoon.controller;

import com.soil2spoon.dto.*;
import com.soil2spoon.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/content")
@RequiredArgsConstructor
public class ContentController {

    private final ContentService contentService;

    @GetMapping("/shipping")
    public ResponseEntity<ShippingPolicyResponse> getShippingPolicy() {
        return ResponseEntity.ok(contentService.getShippingPolicy());
    }

    @GetMapping("/returns")
    public ResponseEntity<ReturnsPolicyResponse> getReturnsPolicy() {
        return ResponseEntity.ok(contentService.getReturnsPolicy());
    }

    @GetMapping("/contact")
    public ResponseEntity<ContactInfoResponse> getContactInfo() {
        return ResponseEntity.ok(contentService.getContactInfo());
    }

    @GetMapping("/site-information")
    public ResponseEntity<SiteInformationResponse> getSiteInformation(
            @RequestParam(required = false) String productId) {
        return ResponseEntity.ok(contentService.getSiteInformation(productId));
    }
}
