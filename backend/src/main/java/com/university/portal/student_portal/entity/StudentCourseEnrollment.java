package com.university.portal.student_portal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentCourseEnrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne(optional = false)
    @JoinColumn(name = "program_course_id")
    private ProgramCourse programCourse;

    @Column(nullable = false)
    private LocalDateTime enrolledAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EnrollmentStatus status = EnrollmentStatus.ENROLLED;

    private String grade; // A, B, C, D, F, etc.

    private Double score; // Numerical score

    @Column(nullable = false)
    private boolean isActive = true;

    public enum EnrollmentStatus {
        ENROLLED,
        DROPPED,
        COMPLETED,
        FAILED
    }
} 