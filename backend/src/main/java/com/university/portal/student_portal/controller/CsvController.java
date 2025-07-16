package com.university.portal.student_portal.controller;

import com.university.portal.student_portal.service.CsvService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/csv")
@RequiredArgsConstructor
public class CsvController {

    private final CsvService csvService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/export/students")
    public ResponseEntity<byte[]> exportStudentsToCsv() throws IOException {
        byte[] csvData = csvService.exportStudentsToCsv();
        
        String filename = "students_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".csv";
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/export/enrollments")
    public ResponseEntity<byte[]> exportEnrollmentsToCsv() throws IOException {
        byte[] csvData = csvService.exportEnrollmentsToCsv();
        
        String filename = "enrollments_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".csv";
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/import/students")
    public ResponseEntity<List<String>> importStudentsFromCsv(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(List.of("Error: Please select a file to upload"));
        }
        
        if (!file.getOriginalFilename().toLowerCase().endsWith(".csv")) {
            return ResponseEntity.badRequest().body(List.of("Error: Please upload a CSV file"));
        }
        
        List<String> results = csvService.importStudentsFromCsv(file);
        return ResponseEntity.ok(results);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/import/enrollments")
    public ResponseEntity<List<String>> bulkEnrollStudentsFromCsv(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(List.of("Error: Please select a file to upload"));
        }
        
        if (!file.getOriginalFilename().toLowerCase().endsWith(".csv")) {
            return ResponseEntity.badRequest().body(List.of("Error: Please upload a CSV file"));
        }
        
        List<String> results = csvService.bulkEnrollStudentsFromCsv(file);
        return ResponseEntity.ok(results);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/template/students")
    public ResponseEntity<byte[]> getStudentsCsvTemplate() throws IOException {
        String template = "Registration Number,Full Name,ID/Passport Number,Gender,Date of Birth,Disability,Phone Number,University Email,Personal Email,Postal Address,Total Billed,Total Paid,Balance\n" +
                         "STU001,John Doe,12345678,Male,1995-05-15,,+254700000001,john.doe@university.com,john.doe@gmail.com,123 Main St,100000.00,50000.00,50000.00\n" +
                         "STU002,Jane Smith,87654321,Female,1998-03-20,,+254700000002,jane.smith@university.com,jane.smith@gmail.com,456 Oak Ave,120000.00,60000.00,60000.00";
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"students_template.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(template.getBytes());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/template/enrollments")
    public ResponseEntity<byte[]> getEnrollmentsCsvTemplate() throws IOException {
        String template = "Student Registration Number,Program Code\n" +
                         "STU001,BSC-CS\n" +
                         "STU002,BSC-IT";
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"enrollments_template.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(template.getBytes());
    }
} 