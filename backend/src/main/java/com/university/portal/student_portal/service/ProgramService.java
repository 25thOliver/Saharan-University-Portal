package com.university.portal.student_portal.service;

import com.university.portal.student_portal.entity.Program;
import com.university.portal.student_portal.repository.ProgramRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProgramService {
    private final ProgramRepository programRepository;

    public List<Program> getAllPrograms() {
        return programRepository.findAll();
    }

    public Optional<Program> getProgramById(Long id) {
        return programRepository.findById(id);
    }

    public Program createProgram(Program program) {
        return programRepository.save(program);
    }

    public Program updateProgram(Long id, Program updated) {
        Program program = programRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Program not found"));
        program.setProgramCode(updated.getProgramCode());
        program.setProgramTitle(updated.getProgramTitle());

        // Update courses in place to avoid orphan removal issues
        program.getCourses().clear();
        if (updated.getCourses() != null) {
            for (var course : updated.getCourses()) {
                course.setProgram(program); // maintain bidirectional link
                program.getCourses().add(course);
            }
        }

        return programRepository.save(program);
    }

    public void deleteProgram(Long id) {
        programRepository.deleteById(id);
    }
} 