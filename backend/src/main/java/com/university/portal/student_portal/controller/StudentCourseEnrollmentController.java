package com.university.portal.student_portal.controller;

import com.university.portal.student_portal.dto.StudentCourseEnrollmentDTO;
import com.university.portal.student_portal.entity.StudentCourseEnrollment;
import com.university.portal.student_portal.entity.Student;
import com.university.portal.student_portal.entity.ProgramCourse;
import com.university.portal.student_portal.service.StudentCourseEnrollmentService;
import com.university.portal.student_portal.service.StudentService;
import com.university.portal.student_portal.service.ProgramCourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student-course-enrollments")
@RequiredArgsConstructor
public class StudentCourseEnrollmentController {

    private final StudentCourseEnrollmentService studentCourseEnrollmentService;
    private final StudentService studentService;
    private final ProgramCourseService programCourseService;

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping
    public ResponseEntity<?> enrollInCourse(
            @RequestParam Long studentId,
            @RequestParam Long programCourseId
    ) {
        try {
            Student student = studentService.getStudentById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            ProgramCourse programCourse = programCourseService.getProgramCourseById(programCourseId)
                    .orElseThrow(() -> new RuntimeException("Program course not found"));

            StudentCourseEnrollment enrollment = studentCourseEnrollmentService.enrollStudentInCourse(student, programCourse);
            return ResponseEntity.ok(StudentCourseEnrollmentDTO.fromEntity(enrollment));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/student/{studentId}")
    public List<StudentCourseEnrollmentDTO> getEnrollmentsByStudent(@PathVariable Long studentId) {
        return studentCourseEnrollmentService.getEnrollmentsByStudent(studentId)
                .stream()
                .map(StudentCourseEnrollmentDTO::fromEntity)
                .collect(java.util.stream.Collectors.toList());
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/student/{studentId}/trimester/{trimesterId}")
    public List<StudentCourseEnrollmentDTO> getEnrollmentsByStudentAndTrimester(
            @PathVariable Long studentId,
            @PathVariable Long trimesterId
    ) {
        return studentCourseEnrollmentService.getEnrollmentsByStudentAndTrimester(studentId, trimesterId)
                .stream()
                .map(StudentCourseEnrollmentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/program-course/{programCourseId}")
    public List<StudentCourseEnrollmentDTO> getEnrollmentsByProgramCourse(@PathVariable Long programCourseId) {
        return studentCourseEnrollmentService.getEnrollmentsByProgramCourse(programCourseId)
                .stream()
                .map(StudentCourseEnrollmentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentCourseEnrollmentDTO> getEnrollmentById(@PathVariable Long id) {
        return studentCourseEnrollmentService.getEnrollmentById(id)
                .map(StudentCourseEnrollmentDTO::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateEnrollmentStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        try {
            StudentCourseEnrollment.EnrollmentStatus enrollmentStatus = 
                    StudentCourseEnrollment.EnrollmentStatus.valueOf(status.toUpperCase());
            StudentCourseEnrollment enrollment = studentCourseEnrollmentService.updateEnrollmentStatus(id, enrollmentStatus);
            return ResponseEntity.ok(StudentCourseEnrollmentDTO.fromEntity(enrollment));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status: " + status);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/grade")
    public ResponseEntity<?> updateGrade(
            @PathVariable Long id,
            @RequestParam String grade,
            @RequestParam(required = false) Double score
    ) {
        try {
            StudentCourseEnrollment enrollment = studentCourseEnrollmentService.updateGrade(id, grade, score);
            return ResponseEntity.ok(StudentCourseEnrollmentDTO.fromEntity(enrollment));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/{id}/drop")
    public ResponseEntity<Void> dropCourse(@PathVariable Long id) {
        try {
            studentCourseEnrollmentService.dropCourse(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnrollment(@PathVariable Long id) {
        studentCourseEnrollmentService.deleteEnrollment(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/student/{studentId}/trimester/{trimesterId}/count")
    public ResponseEntity<Integer> getEnrollmentCountByStudentAndTrimester(
            @PathVariable Long studentId,
            @PathVariable Long trimesterId
    ) {
        int count = studentCourseEnrollmentService.getEnrollmentCountByStudentAndTrimester(studentId, trimesterId);
        return ResponseEntity.ok(count);
    }
} 