package com.university.portal.student_portal.service;

import com.university.portal.student_portal.entity.EnrollmentRequest;
import com.university.portal.student_portal.entity.Program;
import com.university.portal.student_portal.entity.Student;
import com.university.portal.student_portal.repository.EnrollmentRequestRepository;
import com.university.portal.student_portal.repository.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import com.university.portal.student_portal.entity.Trimester;

@Service
@RequiredArgsConstructor
public class EnrollmentRequestService {

    private final EnrollmentRequestRepository enrollmentRequestRepository;
    private final EnrollmentRepository enrollmentRepository;

    public EnrollmentRequest createEnrollmentRequest(Student student, Program program) {
        // Check if student is already enrolled in this program
        if (enrollmentRepository.existsByStudentIdAndProgramId(student.getId(), program.getId())) {
            throw new IllegalStateException("Student is already enrolled in this program");
        }

        // Check if there's already a pending request for this student and program
        if (enrollmentRequestRepository.existsByStudentIdAndProgramIdAndStatus(
                student.getId(), program.getId(), EnrollmentRequest.RequestStatus.PENDING)) {
            throw new IllegalStateException("A pending enrollment request already exists for this program");
        }

        // Allow creating new requests even if previous ones were rejected
        // This gives students a chance to reapply after rejection

        EnrollmentRequest request = EnrollmentRequest.builder()
                .student(student)
                .program(program)
                .status(EnrollmentRequest.RequestStatus.PENDING)
                .requestedAt(LocalDateTime.now())
                .build();

        return enrollmentRequestRepository.save(request);
    }

    public EnrollmentRequest createEnrollmentRequestWithCourses(Student student, Program program, Trimester trimester, List<Long> courseIds) {
        // Check if student is already enrolled in this program for this trimester
        if (enrollmentRepository.existsByStudentIdAndProgramIdAndTrimesterId(student.getId(), program.getId(), trimester.getId())) {
            throw new IllegalStateException("Student is already enrolled in this program for this trimester");
        }

        // Check if there's already a pending request for this student, program, and trimester
        if (enrollmentRequestRepository.existsByStudentIdAndProgramIdAndTrimesterIdAndStatus(
                student.getId(), program.getId(), trimester.getId(), EnrollmentRequest.RequestStatus.PENDING)) {
            throw new IllegalStateException("A pending enrollment request already exists for this program and trimester");
        }

        // Validate course selection
        if (courseIds.size() < trimester.getMinimumCourses()) {
            throw new IllegalStateException("You must select at least " + trimester.getMinimumCourses() + " courses");
        }
        if (courseIds.size() > trimester.getMaximumCourses()) {
            throw new IllegalStateException("You cannot select more than " + trimester.getMaximumCourses() + " courses");
        }

        // Convert course IDs to comma-separated string
        String courseIdsString = courseIds.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(","));

        EnrollmentRequest request = EnrollmentRequest.builder()
                .student(student)
                .program(program)
                .trimester(trimester)
                .selectedCourseIds(courseIdsString)
                .status(EnrollmentRequest.RequestStatus.PENDING)
                .requestedAt(LocalDateTime.now())
                .build();

        return enrollmentRequestRepository.save(request);
    }

    public boolean canRequestEnrollment(Student student, Program program) {
        // Check if student is already enrolled in this program
        if (enrollmentRepository.existsByStudentIdAndProgramId(student.getId(), program.getId())) {
            return false;
        }

        // Check if there's already a pending request for this student and program
        if (enrollmentRequestRepository.existsByStudentIdAndProgramIdAndStatus(
                student.getId(), program.getId(), EnrollmentRequest.RequestStatus.PENDING)) {
            return false;
        }

        // Student can request enrollment if not enrolled and no pending request exists
        // Rejected requests don't prevent new requests
        return true;
    }

    public List<EnrollmentRequest> getEnrollmentRequestsByStudent(Long studentId) {
        return enrollmentRequestRepository.findByStudentId(studentId);
    }

    public List<EnrollmentRequest> getEnrollmentRequestsByStatus(EnrollmentRequest.RequestStatus status) {
        return enrollmentRequestRepository.findByStatus(status);
    }

    public List<EnrollmentRequest> getAllEnrollmentRequests() {
        return enrollmentRequestRepository.findAll();
    }

    public Optional<EnrollmentRequest> getEnrollmentRequestById(Long requestId) {
        return enrollmentRequestRepository.findById(requestId);
    }

    public EnrollmentRequest approveEnrollmentRequest(Long requestId, String adminNotes) {
        EnrollmentRequest request = enrollmentRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Enrollment request not found"));

        if (request.getStatus() != EnrollmentRequest.RequestStatus.PENDING) {
            throw new IllegalStateException("Can only approve pending requests");
        }

        request.setStatus(EnrollmentRequest.RequestStatus.APPROVED);
        request.setProcessedAt(LocalDateTime.now());
        request.setAdminNotes(adminNotes);

        return enrollmentRequestRepository.save(request);
    }

    public EnrollmentRequest rejectEnrollmentRequest(Long requestId, String adminNotes) {
        EnrollmentRequest request = enrollmentRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Enrollment request not found"));

        if (request.getStatus() != EnrollmentRequest.RequestStatus.PENDING) {
            throw new IllegalStateException("Can only reject pending requests");
        }

        request.setStatus(EnrollmentRequest.RequestStatus.REJECTED);
        request.setProcessedAt(LocalDateTime.now());
        request.setAdminNotes(adminNotes);

        return enrollmentRequestRepository.save(request);
    }

    public void deleteEnrollmentRequest(Long requestId) {
        enrollmentRequestRepository.deleteById(requestId);
    }
} 