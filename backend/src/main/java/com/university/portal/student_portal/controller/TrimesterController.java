package com.university.portal.student_portal.controller;

import com.university.portal.student_portal.dto.TrimesterDTO;
import com.university.portal.student_portal.entity.Trimester;
import com.university.portal.student_portal.service.TrimesterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/trimesters")
@RequiredArgsConstructor
public class TrimesterController {

    private final TrimesterService trimesterService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> createTrimester(@RequestBody Trimester trimester) {
        try {
            Trimester createdTrimester = trimesterService.createTrimester(trimester);
            return ResponseEntity.ok(TrimesterDTO.fromEntity(createdTrimester));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public List<TrimesterDTO> getAllTrimesters() {
        return trimesterService.getAllTrimesters()
                .stream()
                .map(TrimesterDTO::fromEntity)
                .collect(java.util.stream.Collectors.toList());
    }

    @GetMapping("/active")
    public List<TrimesterDTO> getActiveTrimesters() {
        return trimesterService.getActiveTrimesters()
                .stream()
                .map(TrimesterDTO::fromEntity)
                .collect(java.util.stream.Collectors.toList());
    }

    @GetMapping("/type/{periodType}")
    public List<TrimesterDTO> getTrimestersByType(@PathVariable String periodType) {
        Trimester.AcademicPeriodType type = Trimester.AcademicPeriodType.valueOf(periodType.toUpperCase());
        return trimesterService.getTrimestersByType(type)
                .stream()
                .map(TrimesterDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/year/{academicYear}")
    public List<TrimesterDTO> getTrimestersByAcademicYear(@PathVariable String academicYear) {
        return trimesterService.getTrimestersByAcademicYear(academicYear)
                .stream()
                .map(TrimesterDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrimesterDTO> getTrimesterById(@PathVariable Long id) {
        return trimesterService.getTrimesterById(id)
                .map(TrimesterDTO::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/period/{period}/year/{academicYear}")
    public ResponseEntity<TrimesterDTO> getTrimesterByPeriodAndYear(@PathVariable String period, @PathVariable String academicYear) {
        return trimesterService.getTrimesterByPeriodAndYear(period, academicYear)
                .map(TrimesterDTO::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTrimester(@PathVariable Long id, @RequestBody Trimester updatedTrimester) {
        try {
            Trimester trimester = trimesterService.updateTrimester(id, updatedTrimester);
            return ResponseEntity.ok(TrimesterDTO.fromEntity(trimester));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrimester(@PathVariable Long id) {
        trimesterService.deleteTrimester(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/current")
    public List<TrimesterDTO> getCurrentTrimesters() {
        return trimesterService.getCurrentTrimesters()
                .stream()
                .map(TrimesterDTO::fromEntity)
                .collect(Collectors.toList());
    }
} 