package com.soil2spoon.service;

import com.soil2spoon.domain.Product;
import com.soil2spoon.domain.Review;
import com.soil2spoon.domain.User;
import com.soil2spoon.dto.ReviewRequest;
import com.soil2spoon.dto.ReviewResponse;
import com.soil2spoon.repository.ProductRepository;
import com.soil2spoon.repository.ReviewRepository;
import com.soil2spoon.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public List<ReviewResponse> findByProductId(Long productId) {
        return findByProductId(productId, null);
    }

    public List<ReviewResponse> findByProductId(Long productId, String currentUserEmail) {
        return reviewRepository.findByProductIdOrderByReviewDateDesc(productId).stream()
                .map(r -> ReviewResponse.from(r, currentUserEmail))
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewResponse create(Long productId, ReviewRequest request, String userEmail) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));
        String authorName = userRepository.findByEmail(userEmail)
                .map(u -> u.getName() != null && !u.getName().isBlank() ? u.getName() : userEmail)
                .orElse(userEmail != null ? userEmail : "Customer");
        int newRatingValue = request.getRating() != null ? request.getRating() : 5;
        User currentUser = userRepository.findByEmail(userEmail).orElse(null);
        Review review = Review.builder()
                .product(product)
                .author(authorName)
                .user(currentUser)
                .rating(newRatingValue)
                .reviewDate(LocalDate.now())
                .text(request.getText() != null ? request.getText().trim() : "")
                .build();
        review = reviewRepository.save(review);

        // Update product's review count and average rating
        int currentCount = product.getReviewCount() != null ? product.getReviewCount() : 0;
        double currentRating = product.getRating() != null ? product.getRating() : 0.0;
        int newCount = currentCount + 1;
        double newAverageRating = currentCount == 0
                ? newRatingValue
                : (currentRating * currentCount + newRatingValue) / newCount;
        product.setReviewCount(newCount);
        product.setRating(Math.round(newAverageRating * 10.0) / 10.0); // round to 1 decimal
        productRepository.save(product);

        return ReviewResponse.from(review, userEmail);
    }

    @Transactional
    public ReviewResponse update(Long productId, Long reviewId, ReviewRequest request, String userEmail) {
        Review review = reviewRepository.findByIdAndProduct_Id(reviewId, productId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));
        User currentUser = userRepository.findByEmail(userEmail).orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (review.getUser() == null || !review.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("You can only edit your own review");
        }
        int newRating = request.getRating() != null ? request.getRating() : review.getRating();
        review.setRating(newRating);
        review.setText(request.getText() != null ? request.getText().trim() : review.getText());
        review = reviewRepository.save(review);

        Product product = review.getProduct();
        List<Review> allReviews = reviewRepository.findByProductIdOrderByReviewDateDesc(product.getId());
        int count = allReviews.size();
        double avg = allReviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        product.setReviewCount(count);
        product.setRating(Math.round(avg * 10.0) / 10.0);
        productRepository.save(product);

        return ReviewResponse.from(review, userEmail);
    }

    @Transactional
    public void deleteById(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));
        Product product = review.getProduct();
        reviewRepository.delete(review);
        List<Review> remaining = reviewRepository.findByProductIdOrderByReviewDateDesc(product.getId());
        int count = remaining.size();
        double avg = remaining.isEmpty() ? 0.0
                : remaining.stream().mapToInt(Review::getRating).average().orElse(0.0);
        product.setReviewCount(count);
        product.setRating(Math.round(avg * 10.0) / 10.0);
        if (product.getImages() != null) {
            product.setImages(new java.util.ArrayList<>(product.getImages()));
        }
        productRepository.save(product);
    }
}
