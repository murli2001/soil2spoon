package com.soil2spoon.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend.base-url:}")
    private String frontendBaseUrl;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    /**
     * Sends a password reset email with a link. Only sends if mail is configured.
     * When mail is not configured, returns the reset link so the API can return it to the client (e.g. for dev/testing).
     */
    public SendResult sendPasswordResetEmail(String toEmail, String resetToken) {
        if (frontendBaseUrl == null || frontendBaseUrl.isBlank()) {
            log.warn("Password reset not sent: app.frontend.base-url is not set. Set APP_FRONTEND_BASE_URL in production.");
            return new SendResult(false, null);
        }
        String resetLink = frontendBaseUrl.replaceAll("/$", "") + "/reset-password?token=" + resetToken;

        if (mailUsername == null || mailUsername.isBlank()) {
            log.info("Password reset link (mail not configured): {}", resetLink);
            return new SendResult(false, resetLink);
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());
            helper.setTo(toEmail);
            helper.setSubject("Reset your password – Soil2Spoon");
            helper.setFrom(mailUsername);
            String html = """
                <p>Hi,</p>
                <p>You requested a password reset. Click the link below to set a new password (link expires in 1 hour):</p>
                <p><a href="%s">Reset password</a></p>
                <p>If you didn't request this, you can ignore this email.</p>
                <p>— Soil2Spoon</p>
                """.formatted(resetLink);
            helper.setText(html, true);
            mailSender.send(message);
            log.info("Password reset email sent to {}", toEmail);
            return new SendResult(true, null);
        } catch (MessagingException e) {
            log.error("Failed to send password reset email to {}", toEmail, e);
            throw new IllegalStateException("Failed to send password reset email. Please try again later.");
        }
    }

    public record SendResult(boolean sent, String resetLinkWhenNotSent) {}
}
