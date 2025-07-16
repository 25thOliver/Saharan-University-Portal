package com.university.portal.student_portal.auth;


import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
}

