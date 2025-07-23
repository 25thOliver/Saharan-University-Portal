package com.university.portal.student_portal.controller;

import com.university.portal.student_portal.entity.Student;
import com.university.portal.student_portal.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.university.portal.student_portal.dto.PasswordChangeRequest;
import com.university.portal.student_portal.dto.PasswordResetRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import com.university.portal.student_portal.dto.StudentCourseEnrollmentDTO.StudentDTO;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    // ✅ Create student (ADMIN only - you can secure this later)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Student> createStudent(@Valid @RequestBody Student student) {
        Student created = studentService.createStudent(student);
        return ResponseEntity.ok(created);
    }

    // ✅ Get all students (ADMIN only - optional security later)
    @GetMapping
    public ResponseEntity<List<StudentDTO>> getAllStudents() {
        List<StudentDTO> dtos = studentService.getAllStudents().stream()
            .map(StudentDTO::fromEntity)
            .toList();
        return ResponseEntity.ok(dtos);
    }

    // ✅ Get student by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id)
            .map(StudentProfileDTO::new)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Delete student
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ Authenticated student profile (based on JWT)
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentStudent(Authentication authentication) {
        System.out.println("DEBUG: authentication.getName() = " + authentication.getName());
        String registrationNumber = authentication.getName(); // subject from JWT

        Optional<Student> student = studentService.getStudentByRegistrationNumber(registrationNumber);
        return student
                .map(s -> ResponseEntity.ok(new StudentProfileDTO(s)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('STUDENT')")
    @PutMapping("/me/password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal org.springframework.security.core.userdetails.User user, @RequestBody PasswordChangeRequest request) {
        studentService.changePassword(user.getUsername(), request);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{registrationNumber}/reset-password")
    public ResponseEntity<?> resetPassword(@PathVariable String registrationNumber, @RequestBody PasswordResetRequest request) {
        studentService.resetPassword(registrationNumber, request);
        return ResponseEntity.ok().build();
    }

    // DTO for safe serialization
    public static class StudentProfileDTO {
        public Long id;
        public String registrationNumber;
        public String fullName;
        public String universityEmail;
        public String personalEmail;
        public String phoneNumber;
        public String gender;
        public String dateOfBirth;
        public String postalAddress;
        public String enrollmentDate;
        // Add more fields as needed

        public StudentProfileDTO(Student s) {
            this.id = s.getId();
            this.registrationNumber = s.getRegistrationNumber();
            this.fullName = s.getFullName();
            this.universityEmail = s.getUniversityEmail();
            this.personalEmail = s.getPersonalEmail();
            this.phoneNumber = s.getPhoneNumber();
            this.gender = s.getGender();
            this.dateOfBirth = s.getDateOfBirth() != null ? s.getDateOfBirth().toString() : null;
            this.postalAddress = s.getPostalAddress();
            this.enrollmentDate = s.getEnrollmentDate() != null ? s.getEnrollmentDate().toString() : null;
        }
    }
}
