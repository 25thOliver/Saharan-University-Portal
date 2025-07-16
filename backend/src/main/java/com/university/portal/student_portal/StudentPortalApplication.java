package com.university.portal.student_portal;

import com.university.portal.student_portal.auth.User;
import com.university.portal.student_portal.auth.UserRepository;
import com.university.portal.student_portal.auth.Role;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@SpringBootApplication
@EnableMethodSecurity
public class StudentPortalApplication {

	public static void main(String[] args) {
		SpringApplication.run(StudentPortalApplication.class, args);
	}

	@Bean
	public CommandLineRunner createDefaultAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			String adminEmail = "admin@university.com";
			if (userRepository.findByEmail(adminEmail).isEmpty()) {
				User admin = User.builder()
						.email(adminEmail)
						.password(passwordEncoder.encode("admin123"))
						.role(Role.ADMIN)
						.build();
				userRepository.save(admin);
				System.out.println("Default admin user created: " + adminEmail + " / admin123");
			}
		};
	}
}
