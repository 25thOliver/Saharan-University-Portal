package com.university.portal.student_portal.controller;

import com.university.portal.student_portal.dto.EnrollmentsByProgramReport;
import com.university.portal.student_portal.dto.FeeStatusResponse;
import com.university.portal.student_portal.dto.PaymentsSummaryReport;
import com.university.portal.student_portal.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/enrollments-by-program")
    public ResponseEntity<List<EnrollmentsByProgramReport>> getEnrollmentsByProgram() {
        return ResponseEntity.ok(reportService.getEnrollmentsByProgram());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/outstanding-balances")
    public ResponseEntity<List<FeeStatusResponse>> getOutstandingBalances() {
        return ResponseEntity.ok(reportService.getOutstandingBalances());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/payments-summary")
    public ResponseEntity<PaymentsSummaryReport> getPaymentsSummary() {
        return ResponseEntity.ok(reportService.getPaymentsSummary());
    }
} 