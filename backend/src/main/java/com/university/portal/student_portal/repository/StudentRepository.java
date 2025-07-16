package com.university.portal.student_portal.repository;

import com.university.portal.student_portal.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByRegistrationNumber(String registrationNumber);
    Optional<Student> findByUniversityEmail(String universityEmail);
}
