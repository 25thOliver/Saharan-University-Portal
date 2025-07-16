package com.university.portal.student_portal.dto;

import com.university.portal.student_portal.entity.Payment;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentRegistrationNumber;
    private Long studentFeeId;
    private BigDecimal amount;
    private Payment.PaymentMethod paymentMethod;
    private String referenceNumber;
    private String receiptNumber;
    private Payment.PaymentStatus status;
    private String notes;
    private LocalDateTime paymentDate;
    private String processedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static PaymentDto fromEntity(Payment payment) {
        PaymentDto dto = new PaymentDto();
        dto.setId(payment.getId());
        dto.setStudentId(payment.getStudent().getId());
        dto.setStudentName(payment.getStudent().getFullName());
        dto.setStudentRegistrationNumber(payment.getStudent().getRegistrationNumber());
        if (payment.getStudentFee() != null) {
            dto.setStudentFeeId(payment.getStudentFee().getId());
        }
        dto.setAmount(payment.getAmount());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setReferenceNumber(payment.getReferenceNumber());
        dto.setReceiptNumber(payment.getReceiptNumber());
        dto.setStatus(payment.getStatus());
        dto.setNotes(payment.getNotes());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setProcessedBy(payment.getProcessedBy());
        dto.setCreatedAt(payment.getCreatedAt());
        dto.setUpdatedAt(payment.getUpdatedAt());
        return dto;
    }
} 