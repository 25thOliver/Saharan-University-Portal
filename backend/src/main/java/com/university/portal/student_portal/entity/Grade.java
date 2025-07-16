package com.university.portal.student_portal.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Grade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "enrollment_id")
    private Enrollment enrollment;

    @Column(nullable = false)
    private String courseCode;

    @Column(nullable = false)
    private String courseTitle;

    @Column(nullable = false)
    private String grade;
} 