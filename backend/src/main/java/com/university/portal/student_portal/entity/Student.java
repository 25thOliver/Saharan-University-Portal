package com.university.portal.student_portal.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Registration number is required")
    @Column(unique = true, nullable = false)
    private String registrationNumber;

    @NotBlank(message = "ID/Passport number is required")
    private String idOrPassportNumber;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Gender is required")
    private String gender;

    @Past(message = "Date of birth must be in the past")
    @Column(nullable = false)
    private LocalDate dateOfBirth;

    private String disability;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @Email(message = "Invalid university email format")
    @NotBlank(message = "University email is required")
    @Column(unique = true, nullable = false)
    private String universityEmail;

    @Email(message = "Invalid personal email format")
    private String personalEmail;

    private String postalAddress;

    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal totalBilled;

    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal totalPaid;

    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal balance;

    @NotBlank(message = "Password is required")
    @Column(nullable = false)
    private String password;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @com.fasterxml.jackson.annotation.JsonManagedReference("student-enrollments")
    @ToString.Exclude
    private List<Enrollment> enrollments;
}
