package com.university.portal.student_portal.dto;

import com.university.portal.student_portal.entity.Enrollment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentDTO {
    private Long id;
    private StudentDTO student;
    private ProgramDTO program;
    private LocalDateTime enrolledAt;

    public static EnrollmentDTO fromEntity(Enrollment enrollment) {
        return new EnrollmentDTO(
            enrollment.getId(),
            StudentDTO.fromEntity(enrollment.getStudent()),
            ProgramDTO.fromEntity(enrollment.getProgram()),
            enrollment.getEnrolledAt()
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
} 