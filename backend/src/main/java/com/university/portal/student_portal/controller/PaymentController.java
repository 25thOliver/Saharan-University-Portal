package com.university.portal.student_portal.controller;

import com.university.portal.student_portal.dto.PaymentDto;
import com.university.portal.student_portal.entity.Payment;
import com.university.portal.student_portal.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<PaymentDto>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<PaymentDto>> getPaymentsByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(paymentService.getPaymentsByStudentId(studentId));
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    @GetMapping("/my-payments")
    public ResponseEntity<List<PaymentDto>> getMyPayments() {
        // This would need to be implemented to get current user's payments
        // For now, returning empty list - would need authentication context
        return ResponseEntity.ok(List.of());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/status/{status}")
    public ResponseEntity<List<PaymentDto>> getPaymentsByStatus(@PathVariable Payment.PaymentStatus status) {
        return ResponseEntity.ok(paymentService.getPaymentsByStatus(status));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/method/{paymentMethod}")
    public ResponseEntity<List<PaymentDto>> getPaymentsByMethod(@PathVariable Payment.PaymentMethod paymentMethod) {
        return ResponseEntity.ok(paymentService.getPaymentsByMethod(paymentMethod));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/date-range")
    public ResponseEntity<List<PaymentDto>> getPaymentsInDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(paymentService.getPaymentsInDateRange(startDate, endDate));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<PaymentDto> getPaymentById(@PathVariable Long id) {
        return paymentService.getPaymentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<PaymentDto> createPayment(@RequestBody PaymentDto paymentDto) {
        try {
            PaymentDto createdPayment = paymentService.createPayment(paymentDto);
            return ResponseEntity.ok(createdPayment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/status")
    public ResponseEntity<PaymentDto> updatePaymentStatus(@PathVariable Long id, @RequestParam Payment.PaymentStatus status) {
        try {
            PaymentDto updatedPayment = paymentService.updatePaymentStatus(id, status);
            return ResponseEntity.ok(updatedPayment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        try {
            paymentService.deletePayment(id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/student/{studentId}/total-paid")
    public ResponseEntity<BigDecimal> getTotalPaidAmount(@PathVariable Long studentId) {
        return ResponseEntity.ok(paymentService.getTotalPaidAmountByStudentId(studentId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/total-in-date-range")
    public ResponseEntity<BigDecimal> getTotalPaymentsInDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(paymentService.getTotalPaymentsInDateRange(startDate, endDate));
    }
} 