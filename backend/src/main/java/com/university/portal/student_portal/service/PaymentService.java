package com.university.portal.student_portal.service;

import com.university.portal.student_portal.dto.PaymentDto;
import com.university.portal.student_portal.entity.Payment;
import com.university.portal.student_portal.entity.Student;
import com.university.portal.student_portal.entity.StudentFee;
import com.university.portal.student_portal.repository.PaymentRepository;
import com.university.portal.student_portal.repository.StudentFeeRepository;
import com.university.portal.student_portal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final StudentRepository studentRepository;
    private final StudentFeeRepository studentFeeRepository;
    private final StudentFeeService studentFeeService;
    
    public List<PaymentDto> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(PaymentDto::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<PaymentDto> getPaymentsByStudentId(Long studentId) {
        return paymentRepository.findByStudentIdOrderByPaymentDateDesc(studentId).stream()
                .map(PaymentDto::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<PaymentDto> getPaymentsByStatus(Payment.PaymentStatus status) {
        return paymentRepository.findByStatus(status).stream()
                .map(PaymentDto::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<PaymentDto> getPaymentsByMethod(Payment.PaymentMethod paymentMethod) {
        return paymentRepository.findByPaymentMethod(paymentMethod).stream()
                .map(PaymentDto::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<PaymentDto> getPaymentsInDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return paymentRepository.findByPaymentDateBetween(startDate, endDate).stream()
                .map(PaymentDto::fromEntity)
                .collect(Collectors.toList());
    }
    
    public Optional<PaymentDto> getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .map(PaymentDto::fromEntity);
    }
    
    @Transactional
    public PaymentDto createPayment(PaymentDto paymentDto) {
        Student student = studentRepository.findById(paymentDto.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found with id: " + paymentDto.getStudentId()));
        
        Payment payment = Payment.builder()
                .student(student)
                .amount(paymentDto.getAmount())
                .paymentMethod(paymentDto.getPaymentMethod())
                .referenceNumber(paymentDto.getReferenceNumber())
                .receiptNumber(paymentDto.getReceiptNumber())
                .status(paymentDto.getStatus() != null ? paymentDto.getStatus() : Payment.PaymentStatus.PENDING)
                .notes(paymentDto.getNotes())
                .paymentDate(paymentDto.getPaymentDate() != null ? paymentDto.getPaymentDate() : LocalDateTime.now())
                .processedBy(paymentDto.getProcessedBy())
                .build();
        
        // If payment is for a specific student fee, link it
        if (paymentDto.getStudentFeeId() != null) {
            StudentFee studentFee = studentFeeRepository.findById(paymentDto.getStudentFeeId())
                    .orElseThrow(() -> new IllegalArgumentException("Student fee not found with id: " + paymentDto.getStudentFeeId()));
            payment.setStudentFee(studentFee);
        }
        
        Payment savedPayment = paymentRepository.save(payment);
        
        // Update student fee status if payment is completed
        if (savedPayment.getStatus() == Payment.PaymentStatus.COMPLETED && savedPayment.getStudentFee() != null) {
            updateStudentFeeAfterPayment(savedPayment.getStudentFee(), savedPayment.getAmount());
        }
        
        return PaymentDto.fromEntity(savedPayment);
    }
    
    @Transactional
    public PaymentDto updatePaymentStatus(Long id, Payment.PaymentStatus status) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found with id: " + id));
        
        Payment.PaymentStatus oldStatus = payment.getStatus();
        payment.setStatus(status);
        
        Payment updatedPayment = paymentRepository.save(payment);
        
        // If status changed to COMPLETED, update student fee
        if (oldStatus != Payment.PaymentStatus.COMPLETED && status == Payment.PaymentStatus.COMPLETED && 
            payment.getStudentFee() != null) {
            updateStudentFeeAfterPayment(payment.getStudentFee(), payment.getAmount());
        }
        
        return PaymentDto.fromEntity(updatedPayment);
    }
    
    public void deletePayment(Long id) {
        if (!paymentRepository.existsById(id)) {
            throw new IllegalArgumentException("Payment not found with id: " + id);
        }
        paymentRepository.deleteById(id);
    }
    
    public BigDecimal getTotalPaidAmountByStudentId(Long studentId) {
        BigDecimal amount = paymentRepository.getTotalPaidAmountByStudentId(studentId);
        return amount != null ? amount : BigDecimal.ZERO;
    }
    
    public BigDecimal getTotalPaymentsInDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        BigDecimal amount = paymentRepository.getTotalPaymentsInDateRange(startDate, endDate);
        return amount != null ? amount : BigDecimal.ZERO;
    }
    
    private void updateStudentFeeAfterPayment(StudentFee studentFee, BigDecimal paymentAmount) {
        BigDecimal currentPaidAmount = studentFee.getPaidAmount() != null ? studentFee.getPaidAmount() : BigDecimal.ZERO;
        BigDecimal newPaidAmount = currentPaidAmount.add(paymentAmount);
        
        studentFee.setPaidAmount(newPaidAmount);
        studentFee.setPaidDate(LocalDate.now());
        
        // Update status based on payment amount
        if (newPaidAmount.compareTo(studentFee.getAmount()) >= 0) {
            studentFee.setStatus(StudentFee.PaymentStatus.PAID);
        } else if (newPaidAmount.compareTo(BigDecimal.ZERO) > 0) {
            studentFee.setStatus(StudentFee.PaymentStatus.PARTIAL);
        }
        
        studentFeeRepository.save(studentFee);
    }
} 