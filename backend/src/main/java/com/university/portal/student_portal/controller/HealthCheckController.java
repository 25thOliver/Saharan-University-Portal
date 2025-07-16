package com.university.portal.student_portal.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthCheckController {

    @GetMapping("/api/health")
    public String check() {
        return "Student Portal API is running! 🚀";
    }
}
