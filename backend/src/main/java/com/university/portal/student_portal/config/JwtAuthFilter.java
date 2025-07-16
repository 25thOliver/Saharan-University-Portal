package com.university.portal.student_portal.config;



import com.university.portal.student_portal.auth.JwtService;
import com.university.portal.student_portal.auth.UserRepository;
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

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final StudentRepository studentRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws IOException, jakarta.servlet.ServletException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String registrationNumber;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        registrationNumber = jwtService.extractUsername(jwt);

        if (registrationNumber != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            Student student = studentRepository.findByRegistrationNumber(registrationNumber).orElse(null);
            if (student != null && jwtService.isTokenValid(jwt, student)) {
                var authToken = new UsernamePasswordAuthenticationToken(
                        student,
                        null,
                        null
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
