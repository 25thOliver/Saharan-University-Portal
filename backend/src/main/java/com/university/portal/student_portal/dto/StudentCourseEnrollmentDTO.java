package com.university.portal.student_portal.dto;

import com.university.portal.student_portal.entity.StudentCourseEnrollment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentCourseEnrollmentDTO {
    private Long id;
    private StudentDTO student;
    private ProgramCourseDTO programCourse;
    private LocalDateTime enrolledAt;
    private String status;
    private String grade;
    private Double score;
    private boolean isActive;

    public static StudentCourseEnrollmentDTO fromEntity(StudentCourseEnrollment enrollment) {
        return new StudentCourseEnrollmentDTO(
            enrollment.getId(),
            StudentDTO.fromEntity(enrollment.getStudent()),
            ProgramCourseDTO.fromEntity(enrollment.getProgramCourse()),
            enrollment.getEnrolledAt(),
            enrollment.getStatus().name(),
            enrollment.getGrade(),
            enrollment.getScore(),
            enrollment.isActive()
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
    public static class ProgramCourseDTO {
        private Long id;
        private ProgramDTO program;
        private CourseDTO course;
        private TrimesterDTO trimester;
        private int creditHours;
        private boolean isCore;
        private boolean isActive;
        private String prerequisites;

        public static ProgramCourseDTO fromEntity(com.university.portal.student_portal.entity.ProgramCourse pc) {
            return new ProgramCourseDTO(
                pc.getId(),
                ProgramDTO.fromEntity(pc.getProgram()),
                CourseDTO.fromEntity(pc.getCourse()),
                TrimesterDTO.fromEntity(pc.getTrimester()),
                pc.getCreditHours(),
                pc.isCore(),
                pc.isActive(),
                pc.getPrerequisites()
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
    public static class CourseDTO {
        private Long id;
        private String courseCode;
        private String courseTitle;

        public static CourseDTO fromEntity(com.university.portal.student_portal.entity.Course course) {
            return new CourseDTO(
                course.getId(),
                course.getCourseCode(),
                course.getCourseTitle()
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

        public static TrimesterDTO fromEntity(com.university.portal.student_portal.entity.Trimester trimester) {
            return new TrimesterDTO(
                trimester.getId(),
                trimester.getName(),
                trimester.getAcademicYear(),
                trimester.getPeriod(),
                trimester.getPeriodType().name()
            );
        }
    }
} 