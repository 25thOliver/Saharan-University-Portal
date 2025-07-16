package com.university.portal.student_portal.auth;


import lombok.Data;

@Data
public class AuthRequest {
    private String email; // for admin login
    private String registrationNumber; // for student login
    private String password;
}

