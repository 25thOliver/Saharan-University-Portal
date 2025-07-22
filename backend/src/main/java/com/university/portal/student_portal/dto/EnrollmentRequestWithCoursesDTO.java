package com.university.portal.student_portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentRequestWithCoursesDTO {
    private Long studentId;
    private Long programId;
    private Long trimesterId;
    private List<Long> courseIds;
} 