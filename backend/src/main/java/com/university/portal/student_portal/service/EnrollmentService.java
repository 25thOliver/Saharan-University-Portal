package com.university.portal.student_portal.service;



import com.university.portal.student_portal.entity.Enrollment;
import com.university.portal.student_portal.entity.Program;
import com.university.portal.student_portal.entity.Student;
import com.university.portal.student_portal.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    public Enrollment enrollStudent(Student student, Program program) {
        if (enrollmentRepository.existsByStudentId(student.getId())) {
            throw new IllegalStateException("Student is already enrolled in a program/course");
        }
        if (enrollmentRepository.existsByStudentIdAndProgramId(student.getId(), program.getId())) {
            throw new IllegalStateException("Student is already enrolled in this program");
        }
        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .program(program)
                .enrolledAt(LocalDateTime.now())
                .build();

        return enrollmentRepository.save(enrollment);
    }

    public List<Enrollment> getEnrollmentsByStudent(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }

    public List<Enrollment> getEnrollmentsByProgram(Long programId) {
        return enrollmentRepository.findByProgramId(programId);
    }

    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    public Optional<Enrollment> getEnrollmentById(Long enrollmentId) {
        return enrollmentRepository.findById(enrollmentId);
    }

    public void deleteEnrollment(Long enrollmentId) {
        enrollmentRepository.deleteById(enrollmentId);
    }
}

