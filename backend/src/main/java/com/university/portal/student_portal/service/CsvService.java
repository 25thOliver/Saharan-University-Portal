package com.university.portal.student_portal.service;

import com.university.portal.student_portal.entity.Student;
import com.university.portal.student_portal.entity.Enrollment;
import com.university.portal.student_portal.entity.Program;
import com.university.portal.student_portal.repository.StudentRepository;
import com.university.portal.student_portal.repository.ProgramRepository;
import com.university.portal.student_portal.repository.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CsvService {
    
    private final StudentRepository studentRepository;
    private final ProgramRepository programRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final PasswordEncoder passwordEncoder;
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final String DEFAULT_PASSWORD = "password123";

    // Export Students to CSV
    public byte[] exportStudentsToCsv() throws IOException {
        List<Student> students = studentRepository.findAll();
        
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (CSVPrinter printer = new CSVPrinter(new OutputStreamWriter(out), CSVFormat.DEFAULT)) {
            // Write header
            printer.printRecord(
                "Registration Number", "Full Name", "ID/Passport Number", "Gender", 
                "Date of Birth", "Disability", "Phone Number", "University Email", 
                "Personal Email", "Postal Address", "Total Billed", "Total Paid", "Balance"
            );
            
            // Write data
            for (Student student : students) {
                printer.printRecord(
                    student.getRegistrationNumber(),
                    student.getFullName(),
                    student.getIdOrPassportNumber(),
                    student.getGender(),
                    student.getDateOfBirth() != null ? student.getDateOfBirth().format(DATE_FORMATTER) : "",
                    student.getDisability() != null ? student.getDisability() : "",
                    student.getPhoneNumber(),
                    student.getUniversityEmail(),
                    student.getPersonalEmail() != null ? student.getPersonalEmail() : "",
                    student.getPostalAddress() != null ? student.getPostalAddress() : "",
                    student.getTotalBilled() != null ? student.getTotalBilled().toString() : "0.00",
                    student.getTotalPaid() != null ? student.getTotalPaid().toString() : "0.00",
                    student.getBalance() != null ? student.getBalance().toString() : "0.00"
                );
            }
        }
        
        return out.toByteArray();
    }

    // Export Enrollments to CSV
    public byte[] exportEnrollmentsToCsv() throws IOException {
        List<Enrollment> enrollments = enrollmentRepository.findAll();
        
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (CSVPrinter printer = new CSVPrinter(new OutputStreamWriter(out), CSVFormat.DEFAULT)) {
            // Write header
            printer.printRecord(
                "Enrollment ID", "Student Registration Number", "Student Name", 
                "Program Code", "Program Title", "Enrolled Date"
            );
            
            // Write data
            for (Enrollment enrollment : enrollments) {
                printer.printRecord(
                    enrollment.getId(),
                    enrollment.getStudent().getRegistrationNumber(),
                    enrollment.getStudent().getFullName(),
                    enrollment.getProgram().getProgramCode(),
                    enrollment.getProgram().getProgramTitle(),
                    enrollment.getEnrolledAt() != null ? enrollment.getEnrolledAt().toString() : ""
                );
            }
        }
        
        return out.toByteArray();
    }

    // Import Students from CSV
    public List<String> importStudentsFromCsv(MultipartFile file) throws IOException {
        List<String> results = new ArrayList<>();
        int successCount = 0;
        int errorCount = 0;
        
        try (InputStreamReader reader = new InputStreamReader(file.getInputStream());
             CSVParser parser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader())) {
            
            for (CSVRecord record : parser) {
                try {
                    Student student = parseStudentFromCsvRecord(record);
                    
                    // Check if student already exists
                    if (studentRepository.findByRegistrationNumber(student.getRegistrationNumber()).isPresent()) {
                        results.add("Error: Student with registration number " + student.getRegistrationNumber() + " already exists");
                        errorCount++;
                        continue;
                    }
                    
                    if (studentRepository.findByUniversityEmail(student.getUniversityEmail()).isPresent()) {
                        results.add("Error: Student with email " + student.getUniversityEmail() + " already exists");
                        errorCount++;
                        continue;
                    }
                    
                    studentRepository.save(student);
                    successCount++;
                    results.add("Success: Imported student " + student.getFullName());
                    
                } catch (Exception e) {
                    errorCount++;
                    results.add("Error: " + e.getMessage());
                }
            }
        }
        
        results.add(0, "Import completed. Success: " + successCount + ", Errors: " + errorCount);
        return results;
    }

    // Bulk Enroll Students from CSV
    public List<String> bulkEnrollStudentsFromCsv(MultipartFile file) throws IOException {
        List<String> results = new ArrayList<>();
        int successCount = 0;
        int errorCount = 0;
        
        try (InputStreamReader reader = new InputStreamReader(file.getInputStream());
             CSVParser parser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader())) {
            
            for (CSVRecord record : parser) {
                try {
                    String studentRegNumber = record.get("Student Registration Number");
                    String programCode = record.get("Program Code");
                    
                    // Find student and program
                    Optional<Student> studentOpt = studentRepository.findByRegistrationNumber(studentRegNumber);
                    Optional<Program> programOpt = programRepository.findByProgramCode(programCode);
                    
                    if (studentOpt.isEmpty()) {
                        results.add("Error: Student with registration number " + studentRegNumber + " not found");
                        errorCount++;
                        continue;
                    }
                    
                    if (programOpt.isEmpty()) {
                        results.add("Error: Program with code " + programCode + " not found");
                        errorCount++;
                        continue;
                    }
                    
                    Student student = studentOpt.get();
                    Program program = programOpt.get();
                    
                    // Check if already enrolled
                    if (enrollmentRepository.existsByStudentIdAndProgramId(student.getId(), program.getId())) {
                        results.add("Error: Student " + studentRegNumber + " is already enrolled in program " + programCode);
                        errorCount++;
                        continue;
                    }
                    
                    // Create enrollment
                    Enrollment enrollment = Enrollment.builder()
                        .student(student)
                        .program(program)
                        .enrolledAt(java.time.LocalDateTime.now())
                        .build();
                    
                    enrollmentRepository.save(enrollment);
                    successCount++;
                    results.add("Success: Enrolled " + studentRegNumber + " in " + programCode);
                    
                } catch (Exception e) {
                    errorCount++;
                    results.add("Error: " + e.getMessage());
                }
            }
        }
        
        results.add(0, "Bulk enrollment completed. Success: " + successCount + ", Errors: " + errorCount);
        return results;
    }

    private Student parseStudentFromCsvRecord(CSVRecord record) {
        Student student = new Student();
        
        student.setRegistrationNumber(record.get("Registration Number"));
        student.setFullName(record.get("Full Name"));
        student.setIdOrPassportNumber(record.get("ID/Passport Number"));
        student.setGender(record.get("Gender"));
        
        // Parse date of birth
        String dobStr = record.get("Date of Birth");
        if (dobStr != null && !dobStr.trim().isEmpty()) {
            try {
                student.setDateOfBirth(LocalDate.parse(dobStr.trim(), DATE_FORMATTER));
            } catch (Exception e) {
                throw new IllegalArgumentException("Invalid date format for Date of Birth: " + dobStr);
            }
        }
        
        student.setDisability(record.get("Disability"));
        student.setPhoneNumber(record.get("Phone Number"));
        student.setUniversityEmail(record.get("University Email"));
        student.setPersonalEmail(record.get("Personal Email"));
        student.setPostalAddress(record.get("Postal Address"));
        
        // Parse financial amounts
        student.setTotalBilled(parseBigDecimal(record.get("Total Billed")));
        student.setTotalPaid(parseBigDecimal(record.get("Total Paid")));
        student.setBalance(parseBigDecimal(record.get("Balance")));
        
        // Set default password
        student.setPassword(passwordEncoder.encode(DEFAULT_PASSWORD));
        
        return student;
    }

    private BigDecimal parseBigDecimal(String value) {
        if (value == null || value.trim().isEmpty()) {
            return BigDecimal.ZERO;
        }
        try {
            return new BigDecimal(value.trim());
        } catch (NumberFormatException e) {
            return BigDecimal.ZERO;
        }
    }
} 