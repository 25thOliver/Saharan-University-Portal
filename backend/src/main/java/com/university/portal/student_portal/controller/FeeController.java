package com.university.portal.student_portal.controller;

import com.university.portal.student_portal.dto.FeeDto;
import com.university.portal.student_portal.entity.Fee;
import com.university.portal.student_portal.service.FeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fees")
@RequiredArgsConstructor
public class FeeController {

    private final FeeService feeService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<FeeDto>> getAllFees() {
        return ResponseEntity.ok(feeService.getAllFees());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/active")
    public ResponseEntity<List<FeeDto>> getActiveFees() {
        return ResponseEntity.ok(feeService.getActiveFees());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/type/{feeType}")
    public ResponseEntity<List<FeeDto>> getFeesByType(@PathVariable Fee.FeeType feeType) {
        return ResponseEntity.ok(feeService.getFeesByType(feeType));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<FeeDto> getFeeById(@PathVariable Long id) {
        return feeService.getFeeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/code/{feeCode}")
    public ResponseEntity<FeeDto> getFeeByCode(@PathVariable String feeCode) {
        return feeService.getFeeByCode(feeCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<FeeDto> createFee(@RequestBody FeeDto feeDto) {
        try {
            FeeDto createdFee = feeService.createFee(feeDto);
            return ResponseEntity.ok(createdFee);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<FeeDto> updateFee(@PathVariable Long id, @RequestBody FeeDto feeDto) {
        try {
            FeeDto updatedFee = feeService.updateFee(id, feeDto);
            return ResponseEntity.ok(updatedFee);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFee(@PathVariable Long id) {
        try {
            feeService.deleteFee(id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateFee(@PathVariable Long id) {
        try {
            feeService.deactivateFee(id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
} 