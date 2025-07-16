package com.university.portal.student_portal.repository;

import com.university.portal.student_portal.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
} 