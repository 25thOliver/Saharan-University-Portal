package com.university.portal.student_portal.service;

import com.university.portal.student_portal.dto.FeeStatusResponse;
import com.university.portal.student_portal.dto.PaymentsSummaryReport;
import com.university.portal.student_portal.dto.EnrollmentsByProgramReport;
import com.university.portal.student_portal.entity.Enrollment;
import com.university.portal.student_portal.entity.Student;
import com.university.portal.student_portal.entity.Program;
import com.university.portal.student_portal.repository.EnrollmentRepository;
import com.university.portal.student_portal.repository.StudentRepository;
import com.university.portal.student_portal.repository.ProgramRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final ProgramRepository programRepository;

    public List<EnrollmentsByProgramReport> getEnrollmentsByProgram() {
        List<Program> programs = programRepository.findAll();
        return programs.stream().map(program -> {
            List<String> studentNames = program.getEnrollments() == null ? List.of() :
                program.getEnrollments().stream()
                    .map(e -> e.getStudent().getFullName())
                    .collect(Collectors.toList());
            List<String> studentRegistrationNumbers = program.getEnrollments() == null ? List.of() :
                program.getEnrollments().stream()
                    .map(e -> e.getStudent().getRegistrationNumber())
                    .collect(Collectors.toList());
            return new EnrollmentsByProgramReport(program.getProgramCode(), program.getProgramTitle(), studentNames, studentRegistrationNumbers);
        }).collect(Collectors.toList());
    }

    public List<FeeStatusResponse> getOutstandingBalances() {
        return studentRepository.findAll().stream()
            .filter(s -> s.getBalance() != null && s.getBalance().compareTo(BigDecimal.ZERO) > 0)
            .map(s -> new FeeStatusResponse(s.getRegistrationNumber(), s.getFullName(), s.getTotalBilled(), s.getTotalPaid(), s.getBalance()))
            .collect(Collectors.toList());
    }

    public PaymentsSummaryReport getPaymentsSummary() {
        List<Student> students = studentRepository.findAll();
        BigDecimal totalPaid = students.stream().map(s -> s.getTotalPaid() == null ? BigDecimal.ZERO : s.getTotalPaid()).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalBilled = students.stream().map(s -> s.getTotalBilled() == null ? BigDecimal.ZERO : s.getTotalBilled()).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalBalance = students.stream().map(s -> s.getBalance() == null ? BigDecimal.ZERO : s.getBalance()).reduce(BigDecimal.ZERO, BigDecimal::add);
        return new PaymentsSummaryReport(totalPaid, totalBilled, totalBalance);
    }
} 