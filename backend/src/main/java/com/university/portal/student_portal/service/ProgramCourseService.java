package com.university.portal.student_portal.service;

import com.university.portal.student_portal.entity.ProgramCourse;
import com.university.portal.student_portal.entity.Program;
import com.university.portal.student_portal.entity.Course;
import com.university.portal.student_portal.entity.Trimester;
import com.university.portal.student_portal.repository.ProgramCourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProgramCourseService {

    private final ProgramCourseRepository programCourseRepository;

    public ProgramCourse addCourseToProgram(Program program, Course course, Trimester trimester, int creditHours, boolean isCore, String prerequisites) {
        // Check if this course is already added to this program for this trimester
        if (programCourseRepository.existsByProgramIdAndCourseIdAndTrimesterId(program.getId(), course.getId(), trimester.getId())) {
            throw new IllegalStateException("This course is already added to this program for the specified trimester");
        }

        ProgramCourse programCourse = ProgramCourse.builder()
                .program(program)
                .course(course)
                .trimester(trimester)
                .creditHours(creditHours)
                .isCore(isCore)
                .prerequisites(prerequisites)
                .isActive(true)
                .build();

        return programCourseRepository.save(programCourse);
    }

    public List<ProgramCourse> getCoursesByProgramAndTrimester(Long programId, Long trimesterId) {
        return programCourseRepository.findByProgramIdAndTrimesterIdAndIsActiveTrue(programId, trimesterId);
    }

    public List<ProgramCourse> getCoursesByTrimester(Long trimesterId) {
        return programCourseRepository.findByTrimesterId(trimesterId);
    }

    public List<ProgramCourse> getCoursesByProgram(Long programId) {
        return programCourseRepository.findByProgramId(programId);
    }

    public Optional<ProgramCourse> getProgramCourseById(Long id) {
        return programCourseRepository.findById(id);
    }

    public ProgramCourse updateProgramCourse(Long id, ProgramCourse updatedProgramCourse) {
        ProgramCourse programCourse = programCourseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Program course not found"));

        programCourse.setCreditHours(updatedProgramCourse.getCreditHours());
        programCourse.setCore(updatedProgramCourse.isCore());
        programCourse.setActive(updatedProgramCourse.isActive());
        programCourse.setPrerequisites(updatedProgramCourse.getPrerequisites());

        return programCourseRepository.save(programCourse);
    }

    public void deleteProgramCourse(Long id) {
        programCourseRepository.deleteById(id);
    }

    public void deactivateProgramCourse(Long id) {
        ProgramCourse programCourse = programCourseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Program course not found"));
        programCourse.setActive(false);
        programCourseRepository.save(programCourse);
    }
} 