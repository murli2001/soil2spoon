package com.soil2spoon.repository;

import com.soil2spoon.domain.Order;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @EntityGraph(attributePaths = { "items", "items.product" })
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);
}
