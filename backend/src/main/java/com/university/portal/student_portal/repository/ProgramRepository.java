package com.university.portal.student_portal.repository;

import com.university.portal.student_portal.entity.Program;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProgramRepository extends JpaRepository<Program, Long> {
    boolean existsByProgramCode(String programCode);
    Optional<Program> findByProgramCode(String programCode);
} 