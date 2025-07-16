package com.university.portal.student_portal.dto;

import com.university.portal.student_portal.entity.Fee;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class FeeDto {
    private Long id;
    private String feeCode;
    private String feeName;
    private String description;
    private BigDecimal amount;
    private Fee.FeeType feeType;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static FeeDto fromEntity(Fee fee) {
        FeeDto dto = new FeeDto();
        dto.setId(fee.getId());
        dto.setFeeCode(fee.getFeeCode());
        dto.setFeeName(fee.getFeeName());
        dto.setDescription(fee.getDescription());
        dto.setAmount(fee.getAmount());
        dto.setFeeType(fee.getFeeType());
        dto.setIsActive(fee.getIsActive());
        dto.setCreatedAt(fee.getCreatedAt());
        dto.setUpdatedAt(fee.getUpdatedAt());
        return dto;
    }
    
    public Fee toEntity() {
        return Fee.builder()
                .id(id)
                .feeCode(feeCode)
                .feeName(feeName)
                .description(description)
                .amount(amount)
                .feeType(feeType)
                .isActive(isActive != null ? isActive : true)
                .build();
    }
} 