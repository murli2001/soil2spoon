package com.soil2spoon.service;

import com.soil2spoon.domain.User;
import com.soil2spoon.dto.AuthResponse;
import com.soil2spoon.dto.LoginRequest;
import com.soil2spoon.dto.SignupRequest;
import com.soil2spoon.dto.UserResponse;
import com.soil2spoon.repository.UserRepository;
import com.soil2spoon.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    @Transactional
    public AuthResponse register(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        Instant now = Instant.now();
        User user = User.builder()
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName().trim())
                .role("USER")
                .createdAt(now)
                .updatedAt(now)
                .build();
        user = userRepository.save(user);
        String token = jwtService.generateToken(user.getEmail(), user.getId());
        return AuthResponse.of(token, toUserResponse(user));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        String token = jwtService.generateToken(user.getEmail(), user.getId());
        return AuthResponse.of(token, toUserResponse(user));
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return toUserResponse(user);
    }

    @Transactional
    public Optional<String> forgotPassword(String email) {
        String normalized = email.trim().toLowerCase();
        User user = userRepository.findByEmail(normalized).orElse(null);
        if (user == null) {
            return Optional.empty();
        }
        String token = UUID.randomUUID().toString();
        Instant expiry = Instant.now().plus(Duration.ofHours(1));
        user.setResetToken(token);
        user.setResetTokenExpiry(expiry);
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);
        try {
            var result = emailService.sendPasswordResetEmail(user.getEmail(), token);
            return Optional.ofNullable(result.resetLinkWhenNotSent());
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}", user.getEmail(), e);
            return Optional.empty();
        }
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired reset link"));
        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(Instant.now())) {
            user.setResetToken(null);
            user.setResetTokenExpiry(null);
            userRepository.save(user);
            throw new IllegalArgumentException("Invalid or expired reset link");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);
    }

    private static UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(String.valueOf(user.getId()))
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole() != null ? user.getRole() : "USER")
                .build();
    }
}
