package com.university.portal.student_portal.service;

import com.university.portal.student_portal.entity.Student;
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

@Service
@RequiredArgsConstructor
public class CertificateService {
    private final StudentRepository studentRepository;

    public byte[] generateCertificatePdf(Long studentId) throws IOException {
        Student student = studentRepository.findById(studentId).orElseThrow();
        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            doc.addPage(page);
            try (PDPageContentStream content = new PDPageContentStream(doc, page)) {
                content.setFont(PDType1Font.HELVETICA_BOLD, 24);
                content.beginText();
                content.newLineAtOffset(100, 700);
                content.showText("Certificate of Enrollment");
                content.endText();

                content.setFont(PDType1Font.HELVETICA, 16);
                content.beginText();
                content.newLineAtOffset(100, 650);
                content.showText("This is to certify that");
                content.endText();

                content.setFont(PDType1Font.HELVETICA_BOLD, 18);
                content.beginText();
                content.newLineAtOffset(100, 620);
                content.showText(student.getFullName());
                content.endText();

                content.setFont(PDType1Font.HELVETICA, 16);
                content.beginText();
                content.newLineAtOffset(100, 590);
                content.showText("Registration Number: " + student.getRegistrationNumber());
                content.endText();

                content.beginText();
                content.newLineAtOffset(100, 560);
                content.showText("is enrolled in the university.");
                content.endText();
            }
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            doc.save(out);
            return out.toByteArray();
        }
    }

    public byte[] generateCertificatePdfByRegistrationNumber(String registrationNumber) throws IOException {
        Student student = studentRepository.findByRegistrationNumber(registrationNumber).orElseThrow();
        return generateCertificatePdf(student.getId());
    }
} 