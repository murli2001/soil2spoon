package com.soil2spoon.service;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

/**
 * Validates addresses using Google Geocoding API.
 * If no API key is configured ({@code app.geocoding.api-key}), validation is skipped (no-op).
 * Flow: build full address string → call Geocoding API → if no result or not in India / pincode mismatch → invalid.
 */
@Service
@RequiredArgsConstructor
public class GeocodingService {

    private static final String GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json";

    private final RestTemplate restTemplate;

    @Value("${app.geocoding.api-key:}")
    private String apiKey;

    /**
     * Validates that the address can be geocoded and that the result matches India and the given pincode (and optionally city/state).
     * @throws IllegalArgumentException if API key is set and address is invalid or could not be verified
     */
    public void validateAddress(String addressLine1, String addressLine2, String city, String state, String pincode) {
        if (apiKey == null || apiKey.isBlank()) {
            return; // skip when no API key (e.g. local dev)
        }
        String fullAddress = buildAddressString(addressLine1, addressLine2, city, state, pincode);
        URI url = UriComponentsBuilder.fromHttpUrl(GEOCODE_URL)
                .queryParam("address", fullAddress)
                .queryParam("key", apiKey)
                .queryParam("region", "in") // bias to India
                .build()
                .toUri();

        ResponseEntity<JsonNode> response;
        try {
            response = restTemplate.getForEntity(url, JsonNode.class);
        } catch (Exception e) {
            throw new IllegalArgumentException("Address verification is temporarily unavailable. Please try again.");
        }

        JsonNode body = response.getBody();
        if (body == null) {
            throw new IllegalArgumentException("Address could not be verified. Please check pincode, city and state.");
        }

        String status = body.path("status").asText("");
        if ("ZERO_RESULTS".equals(status) || "INVALID_REQUEST".equals(status)) {
            throw new IllegalArgumentException("Address could not be verified. Please check pincode, city and state.");
        }
        if (!"OK".equals(status)) {
            throw new IllegalArgumentException("Address could not be verified. Please check pincode, city and state.");
        }

        JsonNode results = body.path("results");
        if (!results.isArray() || results.isEmpty()) {
            throw new IllegalArgumentException("Address could not be verified. Please check pincode, city and state.");
        }

        // Verify first result is in India and pincode matches
        JsonNode firstResult = results.get(0);
        String resultPincode = extractComponent(firstResult, "postal_code");
        String resultCountry = extractComponent(firstResult, "country");
        if (resultCountry != null && !resultCountry.toLowerCase().contains("india")) {
            throw new IllegalArgumentException("Address must be in India. Please check city, state and pincode.");
        }
        if (resultPincode != null && pincode != null) {
            String normalizedInput = pincode.replaceAll("\\D", "");
            String normalizedResult = resultPincode.replaceAll("\\D", "");
            if (!normalizedInput.equals(normalizedResult)) {
                throw new IllegalArgumentException("Pincode does not match the address. Please check pincode, city and state.");
            }
        }
    }

    private String buildAddressString(String line1, String line2, String city, String state, String pincode) {
        StringBuilder sb = new StringBuilder();
        if (line1 != null && !line1.isBlank()) sb.append(line1.trim());
        if (line2 != null && !line2.isBlank()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(line2.trim());
        }
        if (city != null && !city.isBlank()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(city.trim());
        }
        if (state != null && !state.isBlank()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(state.trim());
        }
        if (pincode != null && !pincode.isBlank()) {
            if (sb.length() > 0) sb.append(" ");
            sb.append(pincode.trim().replaceAll("\\D", ""));
        }
        if (sb.length() > 0) sb.append(", India");
        return sb.toString();
    }

    private String extractComponent(JsonNode result, String type) {
        JsonNode components = result.path("address_components");
        if (!components.isArray()) return null;
        for (JsonNode comp : components) {
            JsonNode types = comp.path("types");
            if (!types.isArray()) continue;
            for (JsonNode t : types) {
                if (type.equals(t.asText())) {
                    JsonNode longName = comp.path("long_name");
                    return longName.isMissingNode() ? null : longName.asText();
                }
            }
        }
        return null;
    }
}
