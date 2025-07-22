package com.university.portal.student_portal.repository;

import com.university.portal.student_portal.entity.StudentCourseEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StudentCourseEnrollmentRepository extends JpaRepository<StudentCourseEnrollment, Long> {
    List<StudentCourseEnrollment> findByStudentId(Long studentId);
    List<StudentCourseEnrollment> findByStudentIdAndIsActiveTrue(Long studentId);
    List<StudentCourseEnrollment> findByStudentIdAndProgramCourseTrimesterId(Long studentId, Long trimesterId);
    List<StudentCourseEnrollment> findByProgramCourseId(Long programCourseId);
    boolean existsByStudentIdAndProgramCourseId(Long studentId, Long programCourseId);
    
    @Query("SELECT COUNT(sce) FROM StudentCourseEnrollment sce " +
           "WHERE sce.student.id = :studentId " +
           "AND sce.programCourse.trimester.id = :trimesterId " +
           "AND sce.isActive = true")
    int countActiveEnrollmentsByStudentAndTrimester(@Param("studentId") Long studentId, 
                                                   @Param("trimesterId") Long trimesterId);
} 