package com.university.portal.student_portal.repository;

import com.university.portal.student_portal.entity.EnrollmentRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnrollmentRequestRepository extends JpaRepository<EnrollmentRequest, Long> {
    List<EnrollmentRequest> findByStudentId(Long studentId);
    List<EnrollmentRequest> findByStudentIdAndStatus(Long studentId, EnrollmentRequest.RequestStatus status);
    List<EnrollmentRequest> findByStatus(EnrollmentRequest.RequestStatus status);
    boolean existsByStudentIdAndProgramIdAndStatus(Long studentId, Long programId, EnrollmentRequest.RequestStatus status);
    boolean existsByStudentIdAndProgramIdAndTrimesterIdAndStatus(Long studentId, Long programId, Long trimesterId, EnrollmentRequest.RequestStatus status);
} 