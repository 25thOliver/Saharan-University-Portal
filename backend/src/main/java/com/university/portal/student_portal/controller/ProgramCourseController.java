package com.university.portal.student_portal.controller;

import com.university.portal.student_portal.dto.TrimesterDTO;
import com.university.portal.student_portal.entity.ProgramCourse;
import com.university.portal.student_portal.entity.Program;
import com.university.portal.student_portal.entity.Course;
import com.university.portal.student_portal.entity.Trimester;
import com.university.portal.student_portal.service.ProgramCourseService;
import com.university.portal.student_portal.service.ProgramService;
import com.university.portal.student_portal.service.CourseService;
import com.university.portal.student_portal.service.TrimesterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/program-courses")
@RequiredArgsConstructor
public class ProgramCourseController {

    private final ProgramCourseService programCourseService;
    private final ProgramService programService;
    private final CourseService courseService;
    private final TrimesterService trimesterService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> addCourseToProgram(
            @RequestParam Long programId,
            @RequestParam Long courseId,
            @RequestParam Long trimesterId,
            @RequestParam int creditHours,
            @RequestParam(defaultValue = "true") boolean isCore,
            @RequestParam(required = false) String prerequisites
    ) {
        try {
            Program program = programService.getProgramById(programId)
                    .orElseThrow(() -> new RuntimeException("Program not found"));
            Course course = courseService.getCourseById(courseId)
                    .orElseThrow(() -> new RuntimeException("Course not found"));
            Trimester trimester = trimesterService.getTrimesterById(trimesterId)
                    .orElseThrow(() -> new RuntimeException("Trimester not found"));

            ProgramCourse programCourse = programCourseService.addCourseToProgram(
                    program, course, trimester, creditHours, isCore, prerequisites);
            
            return ResponseEntity.ok(TrimesterDTO.ProgramCourseDTO.fromEntity(programCourse));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @GetMapping("/program/{programId}/trimester/{trimesterId}")
    public List<TrimesterDTO.ProgramCourseDTO> getCoursesByProgramAndTrimester(
            @PathVariable Long programId,
            @PathVariable Long trimesterId
    ) {
        return programCourseService.getCoursesByProgramAndTrimester(programId, trimesterId)
                .stream()
                .map(TrimesterDTO.ProgramCourseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/trimester/{trimesterId}")
    public List<TrimesterDTO.ProgramCourseDTO> getCoursesByTrimester(@PathVariable Long trimesterId) {
        return programCourseService.getCoursesByTrimester(trimesterId)
                .stream()
                .map(TrimesterDTO.ProgramCourseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/program/{programId}")
    public List<TrimesterDTO.ProgramCourseDTO> getCoursesByProgram(@PathVariable Long programId) {
        return programCourseService.getCoursesByProgram(programId)
                .stream()
                .map(TrimesterDTO.ProgramCourseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrimesterDTO.ProgramCourseDTO> getProgramCourseById(@PathVariable Long id) {
        return programCourseService.getProgramCourseById(id)
                .map(TrimesterDTO.ProgramCourseDTO::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProgramCourse(@PathVariable Long id, @RequestBody ProgramCourse updatedProgramCourse) {
        try {
            ProgramCourse programCourse = programCourseService.updateProgramCourse(id, updatedProgramCourse);
            return ResponseEntity.ok(TrimesterDTO.ProgramCourseDTO.fromEntity(programCourse));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgramCourse(@PathVariable Long id) {
        programCourseService.deleteProgramCourse(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateProgramCourse(@PathVariable Long id) {
        programCourseService.deactivateProgramCourse(id);
        return ResponseEntity.ok().build();
    }
} 