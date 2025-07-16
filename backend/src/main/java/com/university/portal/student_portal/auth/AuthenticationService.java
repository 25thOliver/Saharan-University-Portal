package com.university.portal.student_portal.auth;

import com.university.portal.student_portal.entity.Student;
import com.university.portal.student_portal.repository.StudentRepository;
import com.university.portal.student_portal.auth.UserRepository;
import com.university.portal.student_portal.auth.User;
import com.university.portal.student_portal.auth.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public String authenticate(AuthRequest request) {
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            // Admin login
            User admin = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Invalid email or password"));
            if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
                throw new RuntimeException("Invalid email or password");
            }
            // Generate JWT for admin (subject = email)
            return jwtService.generateToken(admin);
        } else if (request.getRegistrationNumber() != null && !request.getRegistrationNumber().isBlank()) {
            // Student login
            Student student = studentRepository.findByRegistrationNumber(request.getRegistrationNumber())
                    .orElseThrow(() -> new RuntimeException("Invalid registration number or password"));
            if (!passwordEncoder.matches(request.getPassword(), student.getPassword())) {
                throw new RuntimeException("Invalid registration number or password");
            }
            // Generate JWT for student (subject = registrationNumber)
            return jwtService.generateToken(student);
        } else {
            throw new RuntimeException("Email or registration number is required");
        }
    }

    public AuthResponse authenticateWithUser(AuthRequest request) {
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            // Admin login
            User admin = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Invalid email or password"));
            if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
                throw new RuntimeException("Invalid email or password");
            }
            String token = jwtService.generateToken(admin);
            return new AuthResponse(token, admin);
        } else if (request.getRegistrationNumber() != null && !request.getRegistrationNumber().isBlank()) {
            // Student login
            Student student = studentRepository.findByRegistrationNumber(request.getRegistrationNumber())
                    .orElseThrow(() -> new RuntimeException("Invalid registration number or password"));
            if (!passwordEncoder.matches(request.getPassword(), student.getPassword())) {
                throw new RuntimeException("Invalid registration number or password");
            }
            String token = jwtService.generateToken(student);
            return new AuthResponse(token, student);
        } else {
            throw new RuntimeException("Email or registration number is required");
        }
    }

    @Bean
    public JwtDecoder jwtDecoder(@Value("${jwt.secret}") String secret) {
        return NimbusJwtDecoder.withSecretKey(new javax.crypto.spec.SecretKeySpec(secret.getBytes(), "HmacSHA256")).build();
    }
}

