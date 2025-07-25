package com.university.portal.student_portal.config;

import com.university.portal.student_portal.repository.StudentRepository;
import com.university.portal.student_portal.entity.Student;
import com.university.portal.student_portal.auth.UserRepository;
import com.university.portal.student_portal.auth.User;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.Customizer;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/enrollments/student/**").hasAnyRole("STUDENT", "ADMIN")
                .requestMatchers("/api/student-fees/student/**").hasAnyRole("STUDENT", "ADMIN")
                .requestMatchers("/api/payments/student/**").hasAnyRole("STUDENT", "ADMIN")
                .requestMatchers("/api/students/me/**").hasRole("STUDENT")
                .requestMatchers("/api/transcript/me").permitAll()
                .requestMatchers("/api/transcript/me/pdf").permitAll()
                .requestMatchers("/api/certificate/me/pdf").permitAll()
                .requestMatchers("/api/students/**").hasAnyRole("STUDENT", "ADMIN")
                .requestMatchers("/api/programs/**").hasAnyRole("STUDENT", "ADMIN")
                .requestMatchers("/api/courses/**").hasAnyRole("STUDENT", "ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            // Try admin by email
            if (username.contains("@")) {
                return userRepository.findByEmail(username)
                    .orElseThrow(() -> new UsernameNotFoundException("Admin not found"));
            }
            // Otherwise, try student by registration number
            Student student = studentRepository.findByRegistrationNumber(username)
                .orElseThrow(() -> new UsernameNotFoundException("Student not found"));
            return org.springframework.security.core.userdetails.User
                .withUsername(student.getRegistrationNumber())
                .password(student.getPassword())
                .authorities("ROLE_STUDENT")
                .build();
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}

