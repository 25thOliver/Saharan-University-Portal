package com.university.portal.student_portal.service;

import com.university.portal.student_portal.entity.Trimester;
import com.university.portal.student_portal.repository.TrimesterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TrimesterService {

    private final TrimesterRepository trimesterRepository;

    public Trimester createTrimester(Trimester trimester) {
        // Validate that the period and academic year combination is unique
        if (trimesterRepository.findByPeriodAndAcademicYear(trimester.getPeriod(), trimester.getAcademicYear()).isPresent()) {
            throw new IllegalStateException("A trimester with this period and academic year already exists");
        }

        // Set default values based on period type
        if (trimester.getPeriodType() == Trimester.AcademicPeriodType.TRIMESTER) {
            if (trimester.getMinimumCourses() == 0) trimester.setMinimumCourses(6);
            if (trimester.getMaximumCourses() == 0) trimester.setMaximumCourses(8);
        } else if (trimester.getPeriodType() == Trimester.AcademicPeriodType.SEMESTER) {
            if (trimester.getMinimumCourses() == 0) trimester.setMinimumCourses(8);
            if (trimester.getMaximumCourses() == 0) trimester.setMaximumCourses(10);
        }

        return trimesterRepository.save(trimester);
    }

    public List<Trimester> getAllTrimesters() {
        return trimesterRepository.findAll();
    }

    public List<Trimester> getActiveTrimesters() {
        return trimesterRepository.findByIsActiveTrue();
    }

    public List<Trimester> getTrimestersByType(Trimester.AcademicPeriodType periodType) {
        return trimesterRepository.findByPeriodType(periodType);
    }

    public List<Trimester> getTrimestersByAcademicYear(String academicYear) {
        return trimesterRepository.findByAcademicYear(academicYear);
    }

    public Optional<Trimester> getTrimesterById(Long id) {
        return trimesterRepository.findById(id);
    }

    public Optional<Trimester> getTrimesterByPeriodAndYear(String period, String academicYear) {
        return trimesterRepository.findByPeriodAndAcademicYear(period, academicYear);
    }

    public Trimester updateTrimester(Long id, Trimester updatedTrimester) {
        Trimester trimester = trimesterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trimester not found"));

        trimester.setName(updatedTrimester.getName());
        trimester.setStartDate(updatedTrimester.getStartDate());
        trimester.setEndDate(updatedTrimester.getEndDate());
        trimester.setActive(updatedTrimester.isActive());
        trimester.setMinimumCourses(updatedTrimester.getMinimumCourses());
        trimester.setMaximumCourses(updatedTrimester.getMaximumCourses());

        return trimesterRepository.save(trimester);
    }

    public void deleteTrimester(Long id) {
        trimesterRepository.deleteById(id);
    }

    public List<Trimester> getCurrentTrimesters() {
        LocalDate now = LocalDate.now();
        return trimesterRepository.findByStartDateBetweenOrEndDateBetween(now, now, now, now);
    }
} 