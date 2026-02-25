package com.soil2spoon.repository;

import com.soil2spoon.domain.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySlug(String slug);

    List<Product> findByFeaturedTrue();

    List<Product> findByTrendingTrue();

    Page<Product> findByCategoryId(String categoryId, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE (:categoryId IS NULL OR p.category.id = :categoryId)")
    Page<Product> findAllByCategoryOptional(@Param("categoryId") String categoryId, Pageable pageable);
}
