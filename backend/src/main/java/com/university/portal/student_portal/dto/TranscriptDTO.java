package com.university.portal.student_portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TranscriptDTO {
    private String studentName;
    private String registrationNumber;
    private String programTitle;
    private List<CourseGrade> courses;
    private Double gpa;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CourseGrade {
        private String courseCode;
        private String courseTitle;
        private String grade;
    }
} 