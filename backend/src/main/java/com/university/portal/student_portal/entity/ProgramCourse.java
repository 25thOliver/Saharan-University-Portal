package com.university.portal.student_portal.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgramCourse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "program_id")
    private Program program;

    @ManyToOne(optional = false)
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne(optional = false)
    @JoinColumn(name = "trimester_id")
    private Trimester trimester;

    @Column(nullable = false)
    private int creditHours;

    @Column(nullable = false)
    private boolean isCore = true; // true for core courses, false for electives

    @Column(nullable = false)
    private boolean isActive = true;

    private String prerequisites; // comma-separated course codes
} 