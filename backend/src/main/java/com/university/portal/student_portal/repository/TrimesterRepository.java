package com.university.portal.student_portal.repository;

import com.university.portal.student_portal.entity.Trimester;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TrimesterRepository extends JpaRepository<Trimester, Long> {
    List<Trimester> findByIsActiveTrue();
    List<Trimester> findByPeriodType(Trimester.AcademicPeriodType periodType);
    List<Trimester> findByAcademicYear(String academicYear);
    Optional<Trimester> findByPeriodAndAcademicYear(String period, String academicYear);
    List<Trimester> findByStartDateBetweenOrEndDateBetween(
        LocalDate start1, LocalDate end1, LocalDate start2, LocalDate end2);
} 