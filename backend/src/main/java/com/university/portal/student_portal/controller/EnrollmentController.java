package com.university.portal.student_portal.controller;

import com.university.portal.student_portal.dto.EnrollmentDTO;
import com.university.portal.student_portal.entity.Enrollment;
import com.university.portal.student_portal.entity.Program;
import com.university.portal.student_portal.entity.Student;
import com.university.portal.student_portal.service.CourseService;
import com.university.portal.student_portal.service.EnrollmentService;
import com.university.portal.student_portal.service.ProgramService;
import com.university.portal.student_portal.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private CourseService courseService;

    @Autowired
    private ProgramService programService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> enrollStudent(
            @RequestParam Long studentId,
            @RequestParam Long programId
    ) {
        try {
            Student student = studentService.getStudentById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            Program program = programService.getProgramById(programId)
                    .orElseThrow(() -> new RuntimeException("Program not found"));
            Enrollment enrollment = enrollmentService.enrollStudent(student, program);
            return ResponseEntity.ok(EnrollmentDTO.fromEntity(enrollment));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    @GetMapping("/student/{studentId}")
    public List<EnrollmentDTO> getEnrollmentsByStudent(@PathVariable Long studentId) {
        return enrollmentService.getEnrollmentsByStudent(studentId)
                .stream()
                .map(EnrollmentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    @GetMapping("/program/{programId}")
    public List<EnrollmentDTO> getEnrollmentsByProgram(@PathVariable Long programId) {
        return enrollmentService.getEnrollmentsByProgram(programId)
                .stream()
                .map(EnrollmentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<EnrollmentDTO> getAllEnrollments() {
        return enrollmentService.getAllEnrollments()
                .stream()
                .map(EnrollmentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<EnrollmentDTO> getEnrollmentById(@PathVariable Long id) {
        return enrollmentService.getEnrollmentById(id)
                .map(EnrollmentDTO::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteEnrollment(@PathVariable Long id) {
        enrollmentService.deleteEnrollment(id);
    }
}
