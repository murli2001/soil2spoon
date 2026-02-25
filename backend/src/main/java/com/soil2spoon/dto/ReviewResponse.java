package com.soil2spoon.dto;

import com.soil2spoon.domain.Review;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {

    private String id;
    private String author;
    private Integer rating;
    private String date;
    private String text;
    private Boolean ownedByCurrentUser;

    public static ReviewResponse from(Review r) {
        return from(r, null);
    }

    public static ReviewResponse from(Review r, String currentUserEmail) {
        if (r == null) return null;
        boolean owned = currentUserEmail != null && r.getUser() != null
                && currentUserEmail.equals(r.getUser().getEmail());
        return ReviewResponse.builder()
                .id(String.valueOf(r.getId()))
                .author(r.getAuthor())
                .rating(r.getRating())
                .date(r.getReviewDate() != null ? r.getReviewDate().toString() : null)
                .text(r.getText())
                .ownedByCurrentUser(owned)
                .build();
    }
}
