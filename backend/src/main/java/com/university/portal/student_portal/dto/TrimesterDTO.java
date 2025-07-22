package com.university.portal.student_portal.dto;

import com.university.portal.student_portal.entity.Trimester;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrimesterDTO {
    private Long id;
    private String name;
    private String academicYear;
    private String period;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean isActive;
    private int minimumCourses;
    private int maximumCourses;
    private String periodType;
    private List<ProgramCourseDTO> programCourses;

    public static TrimesterDTO fromEntity(Trimester trimester) {
        return new TrimesterDTO(
            trimester.getId(),
            trimester.getName(),
            trimester.getAcademicYear(),
            trimester.getPeriod(),
            trimester.getStartDate(),
            trimester.getEndDate(),
            trimester.isActive(),
            trimester.getMinimumCourses(),
            trimester.getMaximumCourses(),
            trimester.getPeriodType().name(),
            trimester.getProgramCourses() != null ? 
                trimester.getProgramCourses().stream()
                    .map(ProgramCourseDTO::fromEntity)
                    .toList() : null
        );
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProgramCourseDTO {
        private Long id;
        private ProgramDTO program;
        private CourseDTO course;
        private int creditHours;
        private boolean isCore;
        private boolean isActive;
        private String prerequisites;

        public static ProgramCourseDTO fromEntity(com.university.portal.student_portal.entity.ProgramCourse pc) {
            return new ProgramCourseDTO(
                pc.getId(),
                ProgramDTO.fromEntity(pc.getProgram()),
                CourseDTO.fromEntity(pc.getCourse()),
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
} 