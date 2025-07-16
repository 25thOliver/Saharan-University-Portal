package com.university.portal.student_portal.repository;

import com.university.portal.student_portal.entity.StudentFee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface StudentFeeRepository extends JpaRepository<StudentFee, Long> {
    List<StudentFee> findByStudentId(Long studentId);
    List<StudentFee> findByStudentIdAndStatus(Long studentId, StudentFee.PaymentStatus status);
    List<StudentFee> findByStatus(StudentFee.PaymentStatus status);
    List<StudentFee> findByDueDateBefore(LocalDate date);
    
    @Query("SELECT SUM(sf.amount) FROM StudentFee sf WHERE sf.student.id = :studentId AND sf.status IN ('PENDING', 'PARTIAL', 'OVERDUE')")
    BigDecimal getTotalOutstandingAmountByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT SUM(sf.paidAmount) FROM StudentFee sf WHERE sf.student.id = :studentId")
    BigDecimal getTotalPaidAmountByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT COUNT(sf) FROM StudentFee sf WHERE sf.student.id = :studentId AND sf.status = 'OVERDUE'")
    Long countOverdueFeesByStudentId(@Param("studentId") Long studentId);
} 