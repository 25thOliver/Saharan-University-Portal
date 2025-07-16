package com.university.portal.student_portal.dto;

import com.university.portal.student_portal.entity.StudentFee;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class StudentFeeDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentRegistrationNumber;
    private Long feeId;
    private String feeCode;
    private String feeName;
    private BigDecimal amount;
    private LocalDate dueDate;
    private StudentFee.PaymentStatus status;
    private BigDecimal paidAmount;
    private LocalDate paidDate;
    private String academicYear;
    private String semester;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static StudentFeeDto fromEntity(StudentFee studentFee) {
        StudentFeeDto dto = new StudentFeeDto();
        dto.setId(studentFee.getId());
        dto.setStudentId(studentFee.getStudent().getId());
        dto.setStudentName(studentFee.getStudent().getFullName());
        dto.setStudentRegistrationNumber(studentFee.getStudent().getRegistrationNumber());
        dto.setFeeId(studentFee.getFee().getId());
        dto.setFeeCode(studentFee.getFee().getFeeCode());
        dto.setFeeName(studentFee.getFee().getFeeName());
        dto.setAmount(studentFee.getAmount());
        dto.setDueDate(studentFee.getDueDate());
        dto.setStatus(studentFee.getStatus());
        dto.setPaidAmount(studentFee.getPaidAmount());
        dto.setPaidDate(studentFee.getPaidDate());
        dto.setAcademicYear(studentFee.getAcademicYear());
        dto.setSemester(studentFee.getSemester());
        dto.setNotes(studentFee.getNotes());
        dto.setCreatedAt(studentFee.getCreatedAt());
        dto.setUpdatedAt(studentFee.getUpdatedAt());
        return dto;
    }
} 