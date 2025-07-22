package com.university.portal.student_portal.repository;

import com.university.portal.student_portal.entity.ProgramCourse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProgramCourseRepository extends JpaRepository<ProgramCourse, Long> {
    List<ProgramCourse> findByProgramIdAndTrimesterId(Long programId, Long trimesterId);
    List<ProgramCourse> findByProgramIdAndTrimesterIdAndIsActiveTrue(Long programId, Long trimesterId);
    List<ProgramCourse> findByTrimesterId(Long trimesterId);
    List<ProgramCourse> findByProgramId(Long programId);
    boolean existsByProgramIdAndCourseIdAndTrimesterId(Long programId, Long courseId, Long trimesterId);
} 