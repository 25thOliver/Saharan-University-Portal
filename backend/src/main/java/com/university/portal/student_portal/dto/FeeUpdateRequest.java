package com.university.portal.student_portal.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class FeeUpdateRequest {
    private BigDecimal totalBilled;
    private BigDecimal totalPaid;
    private BigDecimal balance;
} 