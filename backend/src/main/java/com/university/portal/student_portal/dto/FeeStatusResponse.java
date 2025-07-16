package com.university.portal.student_portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class FeeStatusResponse {
    private String registrationNumber;
    private String fullName;
    private BigDecimal totalBilled;
    private BigDecimal totalPaid;
    private BigDecimal balance;
} 