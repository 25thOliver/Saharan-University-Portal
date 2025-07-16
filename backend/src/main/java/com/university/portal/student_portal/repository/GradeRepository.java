package com.university.portal.student_portal.repository;

import com.university.portal.student_portal.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByEnrollmentId(Long enrollmentId);
} 