package com.soil2spoon.controller;

import com.soil2spoon.dto.AddressRequest;
import com.soil2spoon.dto.AddressResponse;
import com.soil2spoon.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    public ResponseEntity<List<AddressResponse>> getAddresses(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(addressService.getAddresses(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<?> createAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody AddressRequest request) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        try {
            AddressResponse created = addressService.createAddress(userDetails.getUsername(), request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody AddressRequest request) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        try {
            AddressResponse updated = addressService.updateAddress(userDetails.getUsername(), id, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        if (userDetails == null) return ResponseEntity.status(401).build();
        try {
            addressService.deleteAddress(userDetails.getUsername(), id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
