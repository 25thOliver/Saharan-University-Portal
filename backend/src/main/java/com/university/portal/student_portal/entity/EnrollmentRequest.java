package com.university.portal.student_portal.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrollmentRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne(optional = false)
    @JoinColumn(name = "program_id")
    private Program program;

    @ManyToOne(optional = false)
    @JoinColumn(name = "trimester_id")
    private Trimester trimester;

    @Column(nullable = false)
    private String selectedCourseIds; // Comma-separated list of course IDs

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.PENDING;

    @Column(nullable = false)
    private LocalDateTime requestedAt;

    private LocalDateTime processedAt;

    private String adminNotes;

    public enum RequestStatus {
        PENDING,
        APPROVED,
        REJECTED
    }
} 