package com.university.portal.student_portal.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id")
    @com.fasterxml.jackson.annotation.JsonBackReference("student-enrollments")
    private Student student;

    @ManyToOne(optional = false)
    @JoinColumn(name = "program_id")
    @com.fasterxml.jackson.annotation.JsonBackReference("program-enrollments")
    private Program program;

    private LocalDateTime enrolledAt;
}

