package com.university.portal.student_portal.repository;

import com.university.portal.student_portal.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudentId(Long studentId);
    List<Enrollment> findByProgramId(Long programId);
    boolean existsByStudentId(Long studentId);
    boolean existsByStudentIdAndProgramId(Long studentId, Long programId);
    boolean existsByStudentIdAndProgramIdAndTrimesterId(Long studentId, Long programId, Long trimesterId);
}
