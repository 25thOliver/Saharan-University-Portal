package com.university.portal.student_portal.service;

import com.university.portal.student_portal.entity.Grade;
import com.university.portal.student_portal.repository.GradeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GradeService {
    private final GradeRepository gradeRepository;

    public List<Grade> getGradesByEnrollmentId(Long enrollmentId) {
        return gradeRepository.findByEnrollmentId(enrollmentId);
    }

    public Grade saveGrade(Grade grade) {
        return gradeRepository.save(grade);
    }

    public void deleteGrade(Long id) {
        gradeRepository.deleteById(id);
    }
} 