package com.university.portal.student_portal.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String courseCode; // e.g., "CS201"

    @Column(nullable = false)
    private String courseTitle; // e.g., "Data Structures"

    @ManyToOne
    @JoinColumn(name = "program_id")
    @com.fasterxml.jackson.annotation.JsonBackReference
    private Program program;
} 