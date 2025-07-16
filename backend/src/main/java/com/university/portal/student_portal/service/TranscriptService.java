package com.university.portal.student_portal.service;

import com.university.portal.student_portal.dto.TranscriptDTO;
import com.university.portal.student_portal.entity.Enrollment;
import com.university.portal.student_portal.entity.Grade;
import com.university.portal.student_portal.entity.Student;
import com.university.portal.student_portal.repository.EnrollmentRepository;
import com.university.portal.student_portal.repository.GradeRepository;
import com.university.portal.student_portal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TranscriptService {
    private final StudentRepository studentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final GradeRepository gradeRepository;

    public TranscriptDTO getTranscript(Long studentId) {
        Student student = studentRepository.findById(studentId).orElseThrow();
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(studentId);
        // For simplicity, assume one program per student
        String programTitle = enrollments.isEmpty() ? "" : enrollments.get(0).getProgram().getProgramTitle();
        List<TranscriptDTO.CourseGrade> courses = enrollments.stream().flatMap(enrollment ->
            gradeRepository.findByEnrollmentId(enrollment.getId()).stream().map(grade ->
                new TranscriptDTO.CourseGrade(grade.getCourseCode(), grade.getCourseTitle(), grade.getGrade())
            )
        ).collect(Collectors.toList());
        Double gpa = calculateGpa(courses);
        return new TranscriptDTO(student.getFullName(), student.getRegistrationNumber(), programTitle, courses, gpa);
    }

    public TranscriptDTO getTranscriptByRegistrationNumber(String registrationNumber) {
        Student student = studentRepository.findByRegistrationNumber(registrationNumber)
            .orElseThrow(() -> new RuntimeException("Student not found: " + registrationNumber));
        return getTranscript(student.getId());
    }

    private Double calculateGpa(List<TranscriptDTO.CourseGrade> courses) {
        // Dummy GPA calculation: A=4, B=3, C=2, D=1, F=0
        if (courses.isEmpty()) return null;
        double total = 0;
        for (TranscriptDTO.CourseGrade cg : courses) {
            switch (cg.getGrade().toUpperCase()) {
                case "A": total += 4; break;
                case "B": total += 3; break;
                case "C": total += 2; break;
                case "D": total += 1; break;
                default: total += 0;
            }
        }
        return total / courses.size();
    }

    public byte[] generateTranscriptPdf(Long studentId) throws IOException {
        TranscriptDTO transcript = getTranscript(studentId);
        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            doc.addPage(page);
            try (PDPageContentStream content = new PDPageContentStream(doc, page)) {
                content.setFont(PDType1Font.HELVETICA_BOLD, 18);
                content.beginText();
                content.newLineAtOffset(50, 770);
                content.showText("Official Transcript");
                content.endText();

                content.setFont(PDType1Font.HELVETICA, 12);
                content.beginText();
                content.newLineAtOffset(50, 740);
                content.showText("Name: " + transcript.getStudentName());
                content.endText();
                content.beginText();
                content.newLineAtOffset(50, 725);
                content.showText("Reg No: " + transcript.getRegistrationNumber());
                content.endText();
                content.beginText();
                content.newLineAtOffset(50, 710);
                content.showText("Program: " + transcript.getProgramTitle());
                content.endText();
                content.beginText();
                content.newLineAtOffset(50, 695);
                content.showText("GPA: " + (transcript.getGpa() != null ? String.format("%.2f", transcript.getGpa()) : "N/A"));
                content.endText();

                int y = 670;
                content.setFont(PDType1Font.HELVETICA_BOLD, 12);
                content.beginText();
                content.newLineAtOffset(50, y);
                content.showText("Courses:");
                content.endText();
                y -= 20;
                content.setFont(PDType1Font.HELVETICA, 12);
                for (TranscriptDTO.CourseGrade cg : transcript.getCourses()) {
                    content.beginText();
                    content.newLineAtOffset(50, y);
                    content.showText(cg.getCourseCode() + " - " + cg.getCourseTitle() + ": " + cg.getGrade());
                    content.endText();
                    y -= 15;
                    if (y < 50) break; // Avoid overflow for now
                }
            }
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            doc.save(out);
            return out.toByteArray();
        }
    }

    public byte[] generateTranscriptPdfByRegistrationNumber(String registrationNumber) throws IOException {
        Student student = studentRepository.findByRegistrationNumber(registrationNumber).orElseThrow();
        return generateTranscriptPdf(student.getId());
    }
} 