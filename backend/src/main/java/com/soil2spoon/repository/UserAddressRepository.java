package com.soil2spoon.repository;

import com.soil2spoon.domain.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserAddressRepository extends JpaRepository<UserAddress, Long> {

    List<UserAddress> findByUserIdOrderByIsDefaultDescIdAsc(Long userId);

    void deleteByUserId(Long userId);
}
