package com.soil2spoon.repository;

import com.soil2spoon.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProductIdOrderByReviewDateDesc(Long productId);

    java.util.Optional<Review> findByIdAndProduct_Id(Long id, Long productId);
}
