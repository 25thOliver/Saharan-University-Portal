package com.university.portal.student_portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class EnrollmentsByProgramReport {
    private String programCode;
    private String programTitle;
    private List<String> studentNames;
    private List<String> studentRegistrationNumbers;
} 