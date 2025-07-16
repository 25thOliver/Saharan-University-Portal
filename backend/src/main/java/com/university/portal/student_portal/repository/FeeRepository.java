package com.university.portal.student_portal.repository;

import com.university.portal.student_portal.entity.Fee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FeeRepository extends JpaRepository<Fee, Long> {
    Optional<Fee> findByFeeCode(String feeCode);
    List<Fee> findByIsActiveTrue();
    List<Fee> findByFeeType(Fee.FeeType feeType);
    boolean existsByFeeCode(String feeCode);
} 