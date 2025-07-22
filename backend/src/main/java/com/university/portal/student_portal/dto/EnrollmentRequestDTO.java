package com.university.portal.student_portal.dto;

import com.university.portal.student_portal.entity.EnrollmentRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentRequestDTO {
    private Long id;
    private StudentDTO student;
    private ProgramDTO program;
    private TrimesterDTO trimester;
    private String selectedCourseIds;
    private String status;
    private LocalDateTime requestedAt;
    private LocalDateTime processedAt;
    private String adminNotes;

    public static EnrollmentRequestDTO fromEntity(EnrollmentRequest request) {
        return new EnrollmentRequestDTO(
            request.getId(),
            StudentDTO.fromEntity(request.getStudent()),
            ProgramDTO.fromEntity(request.getProgram()),
            request.getTrimester() != null ? TrimesterDTO.fromEntity(request.getTrimester()) : null,
            request.getSelectedCourseIds(),
            request.getStatus().name(),
            request.getRequestedAt(),
            request.getProcessedAt(),
            request.getAdminNotes()
        );
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentDTO {
        private Long id;
        private String registrationNumber;
        private String fullName;

        public static StudentDTO fromEntity(com.university.portal.student_portal.entity.Student student) {
            return new StudentDTO(
                student.getId(),
                student.getRegistrationNumber(),
                student.getFullName()
            );
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProgramDTO {
        private Long id;
        private String programCode;
        private String programTitle;

        public static ProgramDTO fromEntity(com.university.portal.student_portal.entity.Program program) {
            return new ProgramDTO(
                program.getId(),
                program.getProgramCode(),
                program.getProgramTitle()
            );
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TrimesterDTO {
        private Long id;
        private String name;
        private String academicYear;
        private String period;
        private String periodType;
        private int minimumCourses;
        private int maximumCourses;

        public static TrimesterDTO fromEntity(com.university.portal.student_portal.entity.Trimester trimester) {
            return new TrimesterDTO(
                trimester.getId(),
                trimester.getName(),
                trimester.getAcademicYear(),
                trimester.getPeriod(),
                trimester.getPeriodType().name(),
                trimester.getMinimumCourses(),
                trimester.getMaximumCourses()
            );
        }
    }
} 