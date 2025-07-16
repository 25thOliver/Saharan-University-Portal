package com.university.portal.student_portal.service;


import com.university.portal.student_portal.entity.Student;
import com.university.portal.student_portal.repository.StudentRepository;
import com.university.portal.student_portal.dto.PasswordChangeRequest;
import com.university.portal.student_portal.dto.PasswordResetRequest;
import com.university.portal.student_portal.dto.FeeUpdateRequest;
import com.university.portal.student_portal.dto.FeeStatusResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Student createStudent(Student student) {
        student.setPassword(passwordEncoder.encode(student.getPassword()));
        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    public Optional<Student> getStudentByRegistrationNumber(String registrationNumber) {
        return studentRepository.findByRegistrationNumber(registrationNumber);
    }


    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    public void changePassword(String registrationNumber, PasswordChangeRequest request) {
        Student student = studentRepository.findByRegistrationNumber(registrationNumber)
            .orElseThrow(() -> new RuntimeException("Student not found"));
        if (!passwordEncoder.matches(request.getCurrentPassword(), student.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        student.setPassword(passwordEncoder.encode(request.getNewPassword()));
        studentRepository.save(student);
    }

    public void resetPassword(String registrationNumber, PasswordResetRequest request) {
        Student student = studentRepository.findByRegistrationNumber(registrationNumber)
            .orElseThrow(() -> new RuntimeException("Student not found"));
        student.setPassword(passwordEncoder.encode(request.getNewPassword()));
        studentRepository.save(student);
    }

    public void updateFees(String registrationNumber, FeeUpdateRequest request) {
        Student student = studentRepository.findByRegistrationNumber(registrationNumber)
            .orElseThrow(() -> new RuntimeException("Student not found"));
        if (request.getTotalBilled() != null) student.setTotalBilled(request.getTotalBilled());
        if (request.getTotalPaid() != null) student.setTotalPaid(request.getTotalPaid());
        if (request.getBalance() != null) student.setBalance(request.getBalance());
        studentRepository.save(student);
    }

    public FeeStatusResponse getFeeStatus(String registrationNumber) {
        Student student = studentRepository.findByRegistrationNumber(registrationNumber)
            .orElseThrow(() -> new RuntimeException("Student not found"));
        return new FeeStatusResponse(student.getRegistrationNumber(), student.getFullName(), student.getTotalBilled(), student.getTotalPaid(), student.getBalance());
    }

    public List<FeeStatusResponse> getAllFeeStatuses() {
        return studentRepository.findAll().stream()
            .map(s -> new FeeStatusResponse(s.getRegistrationNumber(), s.getFullName(), s.getTotalBilled(), s.getTotalPaid(), s.getBalance()))
            .collect(Collectors.toList());
    }
}
