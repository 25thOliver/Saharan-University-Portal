package com.university.portal.student_portal.controller;

import com.university.portal.student_portal.dto.StudentFeeDto;
import com.university.portal.student_portal.entity.StudentFee;
import com.university.portal.student_portal.service.StudentFeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/student-fees")
@RequiredArgsConstructor
public class StudentFeeController {

    private final StudentFeeService studentFeeService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<StudentFeeDto>> getAllStudentFees() {
        return ResponseEntity.ok(studentFeeService.getAllStudentFees());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<StudentFeeDto>> getStudentFeesByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(studentFeeService.getStudentFeesByStudentId(studentId));
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    @GetMapping("/my-fees")
    public ResponseEntity<List<StudentFeeDto>> getMyFees() {
        // This would need to be implemented to get current user's fees
        // For now, returning empty list - would need authentication context
        return ResponseEntity.ok(List.of());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/status/{status}")
    public ResponseEntity<List<StudentFeeDto>> getStudentFeesByStatus(@PathVariable StudentFee.PaymentStatus status) {
        return ResponseEntity.ok(studentFeeService.getStudentFeesByStatus(status));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/overdue")
    public ResponseEntity<List<StudentFeeDto>> getOverdueFees() {
        return ResponseEntity.ok(studentFeeService.getOverdueFees());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<StudentFeeDto> getStudentFeeById(@PathVariable Long id) {
        return studentFeeService.getStudentFeeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<StudentFeeDto> createStudentFee(@RequestBody StudentFeeDto studentFeeDto) {
        try {
            StudentFeeDto createdStudentFee = studentFeeService.createStudentFee(studentFeeDto);
            return ResponseEntity.ok(createdStudentFee);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<StudentFeeDto> updateStudentFee(@PathVariable Long id, @RequestBody StudentFeeDto studentFeeDto) {
        try {
            StudentFeeDto updatedStudentFee = studentFeeService.updateStudentFee(id, studentFeeDto);
            return ResponseEntity.ok(updatedStudentFee);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudentFee(@PathVariable Long id) {
        try {
            studentFeeService.deleteStudentFee(id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateFeeStatus(@PathVariable Long id, @RequestParam StudentFee.PaymentStatus status) {
        try {
            studentFeeService.updateFeeStatus(id, status);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/student/{studentId}/outstanding")
    public ResponseEntity<BigDecimal> getOutstandingAmount(@PathVariable Long studentId) {
        return ResponseEntity.ok(studentFeeService.getTotalOutstandingAmountByStudentId(studentId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/student/{studentId}/paid")
    public ResponseEntity<BigDecimal> getPaidAmount(@PathVariable Long studentId) {
        return ResponseEntity.ok(studentFeeService.getTotalPaidAmountByStudentId(studentId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/student/{studentId}/overdue-count")
    public ResponseEntity<Long> getOverdueFeesCount(@PathVariable Long studentId) {
        return ResponseEntity.ok(studentFeeService.getOverdueFeesCountByStudentId(studentId));
    }
} 