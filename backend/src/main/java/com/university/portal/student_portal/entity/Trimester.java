package com.university.portal.student_portal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trimester {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // e.g., "Trimester 1.1", "Semester 1"

    @Column(nullable = false)
    private String academicYear; // e.g., "2024/2025"

    @Column(nullable = false)
    private String period; // e.g., "TRIM1_YEAR1", "SEM1_YEAR1"

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(nullable = false)
    private boolean isActive = true;

    @Column(nullable = false)
    private int minimumCourses; // 6 for trimester, 8 for semester

    @Column(nullable = false)
    private int maximumCourses; // 8 for trimester, 10 for semester

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AcademicPeriodType periodType; // TRIMESTER or SEMESTER

    @OneToMany(mappedBy = "trimester", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProgramCourse> programCourses;

    public enum AcademicPeriodType {
        TRIMESTER,
        SEMESTER
    }
} 