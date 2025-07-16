package com.university.portal.student_portal.service;

import com.university.portal.student_portal.dto.StudentFeeDto;
import com.university.portal.student_portal.entity.Fee;
import com.university.portal.student_portal.entity.Student;
import com.university.portal.student_portal.entity.StudentFee;
import com.university.portal.student_portal.repository.FeeRepository;
import com.university.portal.student_portal.repository.StudentFeeRepository;
import com.university.portal.student_portal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentFeeService {
    
    private final StudentFeeRepository studentFeeRepository;
    private final StudentRepository studentRepository;
    private final FeeRepository feeRepository;
    
    public List<StudentFeeDto> getAllStudentFees() {
        return studentFeeRepository.findAll().stream()
                .map(StudentFeeDto::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<StudentFeeDto> getStudentFeesByStudentId(Long studentId) {
        return studentFeeRepository.findByStudentId(studentId).stream()
                .map(StudentFeeDto::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<StudentFeeDto> getStudentFeesByStatus(StudentFee.PaymentStatus status) {
        return studentFeeRepository.findByStatus(status).stream()
                .map(StudentFeeDto::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<StudentFeeDto> getOverdueFees() {
        return studentFeeRepository.findByDueDateBefore(LocalDate.now()).stream()
                .map(StudentFeeDto::fromEntity)
                .collect(Collectors.toList());
    }
    
    public Optional<StudentFeeDto> getStudentFeeById(Long id) {
        return studentFeeRepository.findById(id)
                .map(StudentFeeDto::fromEntity);
    }
    
    public StudentFeeDto createStudentFee(StudentFeeDto studentFeeDto) {
        Student student = studentRepository.findById(studentFeeDto.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found with id: " + studentFeeDto.getStudentId()));
        
        Fee fee = feeRepository.findById(studentFeeDto.getFeeId())
                .orElseThrow(() -> new IllegalArgumentException("Fee not found with id: " + studentFeeDto.getFeeId()));
        
        StudentFee studentFee = StudentFee.builder()
                .student(student)
                .fee(fee)
                .amount(studentFeeDto.getAmount())
                .dueDate(studentFeeDto.getDueDate())
                .status(studentFeeDto.getStatus() != null ? studentFeeDto.getStatus() : StudentFee.PaymentStatus.PENDING)
                .paidAmount(studentFeeDto.getPaidAmount() != null ? studentFeeDto.getPaidAmount() : BigDecimal.ZERO)
                .paidDate(studentFeeDto.getPaidDate())
                .academicYear(studentFeeDto.getAcademicYear())
                .semester(studentFeeDto.getSemester())
                .notes(studentFeeDto.getNotes())
                .build();
        
        StudentFee savedStudentFee = studentFeeRepository.save(studentFee);
        return StudentFeeDto.fromEntity(savedStudentFee);
    }
    
    public StudentFeeDto updateStudentFee(Long id, StudentFeeDto studentFeeDto) {
        StudentFee existingStudentFee = studentFeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Student fee not found with id: " + id));
        
        existingStudentFee.setAmount(studentFeeDto.getAmount());
        existingStudentFee.setDueDate(studentFeeDto.getDueDate());
        existingStudentFee.setStatus(studentFeeDto.getStatus());
        existingStudentFee.setPaidAmount(studentFeeDto.getPaidAmount());
        existingStudentFee.setPaidDate(studentFeeDto.getPaidDate());
        existingStudentFee.setAcademicYear(studentFeeDto.getAcademicYear());
        existingStudentFee.setSemester(studentFeeDto.getSemester());
        existingStudentFee.setNotes(studentFeeDto.getNotes());
        
        StudentFee updatedStudentFee = studentFeeRepository.save(existingStudentFee);
        return StudentFeeDto.fromEntity(updatedStudentFee);
    }
    
    public void deleteStudentFee(Long id) {
        if (!studentFeeRepository.existsById(id)) {
            throw new IllegalArgumentException("Student fee not found with id: " + id);
        }
        studentFeeRepository.deleteById(id);
    }
    
    public BigDecimal getTotalOutstandingAmountByStudentId(Long studentId) {
        BigDecimal amount = studentFeeRepository.getTotalOutstandingAmountByStudentId(studentId);
        return amount != null ? amount : BigDecimal.ZERO;
    }
    
    public BigDecimal getTotalPaidAmountByStudentId(Long studentId) {
        BigDecimal amount = studentFeeRepository.getTotalPaidAmountByStudentId(studentId);
        return amount != null ? amount : BigDecimal.ZERO;
    }
    
    public Long getOverdueFeesCountByStudentId(Long studentId) {
        Long count = studentFeeRepository.countOverdueFeesByStudentId(studentId);
        return count != null ? count : 0L;
    }
    
    public void updateFeeStatus(Long studentFeeId, StudentFee.PaymentStatus status) {
        StudentFee studentFee = studentFeeRepository.findById(studentFeeId)
                .orElseThrow(() -> new IllegalArgumentException("Student fee not found with id: " + studentFeeId));
        
        studentFee.setStatus(status);
        studentFeeRepository.save(studentFee);
    }
} 