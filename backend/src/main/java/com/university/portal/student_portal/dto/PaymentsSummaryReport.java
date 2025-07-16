package com.university.portal.student_portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class PaymentsSummaryReport {
    private BigDecimal totalPaid;
    private BigDecimal totalBilled;
    private BigDecimal totalBalance;
} 