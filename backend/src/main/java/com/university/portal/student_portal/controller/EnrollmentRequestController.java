package com.university.portal.student_portal.controller;

import com.university.portal.student_portal.dto.EnrollmentRequestDTO;
import com.university.portal.student_portal.dto.EnrollmentRequestWithCoursesDTO;
import com.university.portal.student_portal.entity.EnrollmentRequest;
import com.university.portal.student_portal.entity.Program;
import com.university.portal.student_portal.entity.Student;
import com.university.portal.student_portal.entity.Trimester;
import com.university.portal.student_portal.service.EnrollmentRequestService;
import com.university.portal.student_portal.service.StudentService;
import com.university.portal.student_portal.service.ProgramService;
import com.university.portal.student_portal.service.TrimesterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/enrollment-requests")
@RequiredArgsConstructor
public class EnrollmentRequestController {

    private final EnrollmentRequestService enrollmentRequestService;
    private final StudentService studentService;
    private final ProgramService programService;
    private final TrimesterService trimesterService;

    // Student endpoints
    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping
    public ResponseEntity<?> createEnrollmentRequest(
            @RequestParam Long studentId,
            @RequestParam Long programId
    ) {
        try {
            Student student = studentService.getStudentById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            Program program = programService.getProgramById(programId)
                    .orElseThrow(() -> new RuntimeException("Program not found"));      
            EnrollmentRequest request = enrollmentRequestService.createEnrollmentRequest(student, program);
            return ResponseEntity.ok(EnrollmentRequestDTO.fromEntity(request));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/with-courses")
    public ResponseEntity<?> createEnrollmentRequestWithCourses(
            @RequestBody EnrollmentRequestWithCoursesDTO requestDTO
    ) {
        try {
            Student student = studentService.getStudentById(requestDTO.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            Program program = programService.getProgramById(requestDTO.getProgramId())
                    .orElseThrow(() -> new RuntimeException("Program not found"));
            Trimester trimester = trimesterService.getTrimesterById(requestDTO.getTrimesterId())
                    .orElseThrow(() -> new RuntimeException("Trimester not found"));      
            EnrollmentRequest request = enrollmentRequestService.createEnrollmentRequestWithCourses(
                    student, program, trimester, requestDTO.getCourseIds());
            return ResponseEntity.ok(EnrollmentRequestDTO.fromEntity(request));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/student/{studentId}")
    public List<EnrollmentRequestDTO> getEnrollmentRequestsByStudent(@PathVariable Long studentId) {
        return enrollmentRequestService.getEnrollmentRequestsByStudent(studentId)
                .stream()
                .map(EnrollmentRequestDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/can-request/{studentId}/{programId}")
    public ResponseEntity<Map<String, Object>> canRequestEnrollment(
            @PathVariable Long studentId,
            @PathVariable Long programId
    ) {
        try {
            Student student = studentService.getStudentById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            Program program = programService.getProgramById(programId)
                    .orElseThrow(() -> new RuntimeException("Program not found"));      
            boolean canRequest = enrollmentRequestService.canRequestEnrollment(student, program);
            Map<String, Object> response = new HashMap<>();
            response.put("canRequest", canRequest);
            
            if (!canRequest) {
                if (enrollmentRequestService.getEnrollmentRequestsByStudent(studentId)
                        .stream()
                        .anyMatch(req -> req.getProgram().getId().equals(programId) && 
                                       req.getStatus() == EnrollmentRequest.RequestStatus.PENDING)) {
                    response.put("reason", "A pending request already exists for this program");
                } else {
                    response.put("reason", "Student is already enrolled in this program");
                }
            }
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    // Admin endpoints
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<EnrollmentRequestDTO> getAllEnrollmentRequests() {
        return enrollmentRequestService.getAllEnrollmentRequests()
                .stream()
                .map(EnrollmentRequestDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/status/{status}")
    public List<EnrollmentRequestDTO> getEnrollmentRequestsByStatus(@PathVariable String status) {
        EnrollmentRequest.RequestStatus requestStatus = EnrollmentRequest.RequestStatus.valueOf(status.toUpperCase());
        return enrollmentRequestService.getEnrollmentRequestsByStatus(requestStatus)
                .stream()
                .map(EnrollmentRequestDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<EnrollmentRequestDTO> getEnrollmentRequestById(@PathVariable Long id) {
        return enrollmentRequestService.getEnrollmentRequestById(id)
                .map(EnrollmentRequestDTO::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveEnrollmentRequest(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "") String adminNotes
    ) {
        try {
            EnrollmentRequest request = enrollmentRequestService.approveEnrollmentRequest(id, adminNotes);
            return ResponseEntity.ok(EnrollmentRequestDTO.fromEntity(request));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectEnrollmentRequest(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "") String adminNotes
    ) {
        try {
            EnrollmentRequest request = enrollmentRequestService.rejectEnrollmentRequest(id, adminNotes);
            return ResponseEntity.ok(EnrollmentRequestDTO.fromEntity(request));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnrollmentRequest(@PathVariable Long id) {
        enrollmentRequestService.deleteEnrollmentRequest(id);
        return ResponseEntity.noContent().build();
    }
} 