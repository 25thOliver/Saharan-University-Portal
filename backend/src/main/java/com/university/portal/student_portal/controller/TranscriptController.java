package com.university.portal.student_portal.controller;

import com.university.portal.student_portal.dto.TranscriptDTO;
import com.university.portal.student_portal.service.TranscriptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transcript")
@RequiredArgsConstructor
public class TranscriptController {
    private final TranscriptService transcriptService;

    // @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/me")
    public ResponseEntity<TranscriptDTO> getTranscript(Authentication authentication) {
        String registrationNumber;
        if (authentication != null) {
            registrationNumber = authentication.getName();
        } else {
            // For testing purposes, use a default registration number
            registrationNumber = "21/04956";
        }
        return ResponseEntity.ok(transcriptService.getTranscriptByRegistrationNumber(registrationNumber));
    }

    // @PreAuthorize("hasRole('STUDENT')")
    @GetMapping("/me/pdf")
    public ResponseEntity<byte[]> downloadTranscriptPdf(Authentication authentication) {
        String registrationNumber;
        if (authentication != null) {
            registrationNumber = authentication.getName();
        } else {
            // For testing purposes, use a default registration number
            registrationNumber = "21/04956";
        }
        try {
            byte[] pdf = transcriptService.generateTranscriptPdfByRegistrationNumber(registrationNumber);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transcript.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
} 