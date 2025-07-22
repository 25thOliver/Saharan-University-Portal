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
    public ResponseEntity<Optional<Student>> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    // ✅ Delete student
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ Authenticated student profile (based on JWT)
    @GetMapping("/me")
    public ResponseEntity<Student> getCurrentStudent(Authentication authentication) {
        String registrationNumber = authentication.getName(); // subject from JWT

        Optional<Student> student = studentService.getStudentByRegistrationNumber(registrationNumber);
        return student
                .map(ResponseEntity::ok)
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
}
