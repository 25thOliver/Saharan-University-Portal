package com.university.portal.student_portal.service;

import com.university.portal.student_portal.entity.StudentCourseEnrollment;
import com.university.portal.student_portal.entity.Student;
import com.university.portal.student_portal.entity.ProgramCourse;
import com.university.portal.student_portal.repository.StudentCourseEnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudentCourseEnrollmentService {

    private final StudentCourseEnrollmentRepository studentCourseEnrollmentRepository;
    private final TrimesterService trimesterService;

    public StudentCourseEnrollment enrollStudentInCourse(Student student, ProgramCourse programCourse) {
        // Check if student is already enrolled in this course for this trimester
        if (studentCourseEnrollmentRepository.existsByStudentIdAndProgramCourseId(student.getId(), programCourse.getId())) {
            throw new IllegalStateException("Student is already enrolled in this course for this trimester");
        }

        // Validate course enrollment limits
        validateEnrollmentLimits(student.getId(), programCourse.getTrimester().getId(), programCourse.getTrimester());

        StudentCourseEnrollment enrollment = StudentCourseEnrollment.builder()
                .student(student)
                .programCourse(programCourse)
                .enrolledAt(LocalDateTime.now())
                .status(StudentCourseEnrollment.EnrollmentStatus.ENROLLED)
                .isActive(true)
                .build();

        return studentCourseEnrollmentRepository.save(enrollment);
    }

    private void validateEnrollmentLimits(Long studentId, Long trimesterId, com.university.portal.student_portal.entity.Trimester trimester) {
        int currentEnrollments = studentCourseEnrollmentRepository.countActiveEnrollmentsByStudentAndTrimester(studentId, trimesterId);
        
        if (currentEnrollments >= trimester.getMaximumCourses()) {
            throw new IllegalStateException("Student has reached the maximum number of courses (" + trimester.getMaximumCourses() + ") for this " + trimester.getPeriodType().name().toLowerCase());
        }
    }

    public List<StudentCourseEnrollment> getEnrollmentsByStudent(Long studentId) {
        return studentCourseEnrollmentRepository.findByStudentIdAndIsActiveTrue(studentId);
    }

    public List<StudentCourseEnrollment> getEnrollmentsByStudentAndTrimester(Long studentId, Long trimesterId) {
        return studentCourseEnrollmentRepository.findByStudentIdAndProgramCourseTrimesterId(studentId, trimesterId);
    }

    public List<StudentCourseEnrollment> getEnrollmentsByProgramCourse(Long programCourseId) {
        return studentCourseEnrollmentRepository.findByProgramCourseId(programCourseId);
    }

    public Optional<StudentCourseEnrollment> getEnrollmentById(Long id) {
        return studentCourseEnrollmentRepository.findById(id);
    }

    public StudentCourseEnrollment updateEnrollmentStatus(Long id, StudentCourseEnrollment.EnrollmentStatus status) {
        StudentCourseEnrollment enrollment = studentCourseEnrollmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        enrollment.setStatus(status);
        return studentCourseEnrollmentRepository.save(enrollment);
    }

    public StudentCourseEnrollment updateGrade(Long id, String grade, Double score) {
        StudentCourseEnrollment enrollment = studentCourseEnrollmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        enrollment.setGrade(grade);
        enrollment.setScore(score);
        if (grade != null && !grade.equals("F")) {
            enrollment.setStatus(StudentCourseEnrollment.EnrollmentStatus.COMPLETED);
        } else if (grade != null && grade.equals("F")) {
            enrollment.setStatus(StudentCourseEnrollment.EnrollmentStatus.FAILED);
        }

        return studentCourseEnrollmentRepository.save(enrollment);
    }

    public void dropCourse(Long id) {
        StudentCourseEnrollment enrollment = studentCourseEnrollmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        enrollment.setStatus(StudentCourseEnrollment.EnrollmentStatus.DROPPED);
        enrollment.setActive(false);
        studentCourseEnrollmentRepository.save(enrollment);
    }

    public void deleteEnrollment(Long id) {
        studentCourseEnrollmentRepository.deleteById(id);
    }

    public int getEnrollmentCountByStudentAndTrimester(Long studentId, Long trimesterId) {
        return studentCourseEnrollmentRepository.countActiveEnrollmentsByStudentAndTrimester(studentId, trimesterId);
    }
} 