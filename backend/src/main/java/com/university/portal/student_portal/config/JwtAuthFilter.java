package com.university.portal.student_portal.config;

import com.university.portal.student_portal.auth.JwtService;
import com.university.portal.student_portal.auth.UserRepository;
import com.university.portal.student_portal.auth.User;
import com.university.portal.student_portal.repository.StudentRepository;
import com.university.portal.student_portal.entity.Student;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws IOException, jakarta.servlet.ServletException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String subject;

        // Skip JWT validation for permitted endpoints
        String requestURI = request.getRequestURI();
        if (requestURI.equals("/api/transcript/me") || 
            requestURI.equals("/api/transcript/me/pdf") || 
            requestURI.equals("/api/certificate/me/pdf")) {
            filterChain.doFilter(request, response);
            return;
        }

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        subject = jwtService.extractUsername(jwt);

        System.out.println("JWT Filter - Subject: " + subject);

        if (subject != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Extract role from JWT token
            String role = jwtService.extractClaim(jwt, claims -> claims.get("role", String.class));
            System.out.println("JWT Filter - Role: " + role);
            
            if ("STUDENT".equals(role)) {
                // Handle student authentication
                Student student = studentRepository.findByRegistrationNumber(subject).orElse(null);
                System.out.println("JWT Filter - Student found: " + (student != null));
                if (student != null && jwtService.isTokenValid(jwt, student)) {
                    System.out.println("JWT Filter - Token valid, setting authentication");
                    var authToken = new UsernamePasswordAuthenticationToken(
                            student,
                            null,
                            List.of(new SimpleGrantedAuthority("ROLE_STUDENT"))
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    System.out.println("JWT Filter - Token validation failed");
                }
            } else if ("ADMIN".equals(role)) {
                // Handle admin authentication
                User admin = userRepository.findByEmail(subject).orElse(null);
                System.out.println("JWT Filter - Admin found: " + (admin != null));
                if (admin != null) {
                    System.out.println("JWT Filter - Setting admin authentication");
                    var authToken = new UsernamePasswordAuthenticationToken(
                            admin,
                            null,
                            List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
