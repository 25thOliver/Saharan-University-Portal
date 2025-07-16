package com.university.portal.student_portal.controller;

import com.university.portal.student_portal.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/certificate")
@RequiredArgsConstructor
public class CertificateController {
    private final CertificateService certificateService;

    // @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/me/pdf")
    public ResponseEntity<byte[]> downloadCertificatePdf(Authentication authentication) {
        String registrationNumber;
        if (authentication != null) {
            registrationNumber = authentication.getName();
        } else {
            // For testing purposes, use a default registration number
            registrationNumber = "21/04956";
        }
        try {
            byte[] pdf = certificateService.generateCertificatePdfByRegistrationNumber(registrationNumber);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=certificate.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
} 