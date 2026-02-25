package com.soil2spoon.service;

import com.soil2spoon.domain.User;
import com.soil2spoon.domain.UserAddress;
import com.soil2spoon.dto.AddressRequest;
import com.soil2spoon.dto.AddressResponse;
import com.soil2spoon.repository.UserAddressRepository;
import com.soil2spoon.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final UserRepository userRepository;
    private final UserAddressRepository addressRepository;
    private final GeocodingService geocodingService;

    @Transactional(readOnly = true)
    public List<AddressResponse> getAddresses(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return addressRepository.findByUserIdOrderByIsDefaultDescIdAsc(user.getId()).stream()
                .map(AddressResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public AddressResponse createAddress(String userEmail, AddressRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        validateRequest(request);
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            addressRepository.findByUserIdOrderByIsDefaultDescIdAsc(user.getId()).forEach(a -> a.setIsDefault(false));
            addressRepository.flush();
        }
        UserAddress address = UserAddress.builder()
                .user(user)
                .name(request.getName())
                .phone(request.getPhone())
                .addressLine1(request.getAddressLine1())
                .addressLine2(request.getAddressLine2())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .isDefault(Boolean.TRUE.equals(request.getIsDefault()))
                .build();
        address = addressRepository.save(address);
        return AddressResponse.from(address);
    }

    @Transactional
    public AddressResponse updateAddress(String userEmail, Long addressId, AddressRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        UserAddress address = addressRepository.findById(addressId)
                .orElseThrow(() -> new IllegalArgumentException("Address not found"));
        if (!address.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Address not found");
        }
        validateRequest(request);
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            addressRepository.findByUserIdOrderByIsDefaultDescIdAsc(user.getId()).forEach(a -> a.setIsDefault(false));
            addressRepository.flush();
        }
        address.setName(request.getName());
        address.setPhone(request.getPhone());
        address.setAddressLine1(request.getAddressLine1());
        address.setAddressLine2(request.getAddressLine2());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
        address.setIsDefault(Boolean.TRUE.equals(request.getIsDefault()));
        address = addressRepository.save(address);
        return AddressResponse.from(address);
    }

    @Transactional
    public void deleteAddress(String userEmail, Long addressId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        UserAddress address = addressRepository.findById(addressId)
                .orElseThrow(() -> new IllegalArgumentException("Address not found"));
        if (!address.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Address not found");
        }
        addressRepository.delete(address);
    }

    private void validateRequest(AddressRequest request) {
        if (request == null || request.getName() == null || request.getName().isBlank()
                || request.getPhone() == null || request.getPhone().isBlank()
                || request.getAddressLine1() == null || request.getAddressLine1().isBlank()
                || request.getCity() == null || request.getCity().isBlank()
                || request.getState() == null || request.getState().isBlank()
                || request.getPincode() == null || request.getPincode().isBlank()) {
            throw new IllegalArgumentException("Name, phone, address line 1, city, state and pincode are required");
        }
        validatePhone(request.getPhone());
        validatePincode(request.getPincode());
        if (request.getName().trim().length() < 2) {
            throw new IllegalArgumentException("Name must be at least 2 characters");
        }
        if (request.getAddressLine1().trim().length() > 500) {
            throw new IllegalArgumentException("Address line 1 is too long");
        }
        if (request.getCity().trim().length() > 100 || request.getState().trim().length() > 100) {
            throw new IllegalArgumentException("City and state must be 100 characters or less");
        }
        geocodingService.validateAddress(
                request.getAddressLine1(),
                request.getAddressLine2(),
                request.getCity(),
                request.getState(),
                request.getPincode()
        );
    }

    /**
     * Validates Indian phone number: 10 digits (optional +91 or 0 prefix allowed).
     */
    private void validatePhone(String phone) {
        if (phone == null) return;
        String digits = phone.replaceAll("\\D", "");
        if (digits.length() == 10) return;
        if (digits.length() == 11 && digits.startsWith("0")) return;
        if (digits.length() == 12 && digits.startsWith("91")) return;
        throw new IllegalArgumentException("Phone must be a valid 10-digit Indian number");
    }

    /**
     * Validates Indian pincode: exactly 6 digits.
     */
    private void validatePincode(String pincode) {
        if (pincode == null) return;
        String digits = pincode.replaceAll("\\D", "");
        if (digits.length() != 6) {
            throw new IllegalArgumentException("Pincode must be exactly 6 digits");
        }
    }

    /**
     * Validates shipping address fields. Used when creating an order with inline shipping details.
     */
    public void validateShippingAddress(String name, String phone, String addressLine1, String addressLine2, String city, String state, String pincode) {
        if (name == null || name.isBlank()
                || phone == null || phone.isBlank()
                || addressLine1 == null || addressLine1.isBlank()
                || city == null || city.isBlank()
                || state == null || state.isBlank()
                || pincode == null || pincode.isBlank()) {
            throw new IllegalArgumentException("Name, phone, address line 1, city, state and pincode are required");
        }
        validatePhone(phone);
        validatePincode(pincode);
        if (name.trim().length() < 2) {
            throw new IllegalArgumentException("Name must be at least 2 characters");
        }
        geocodingService.validateAddress(
                addressLine1,
                addressLine2,
                city,
                state,
                pincode
        );
    }
}
