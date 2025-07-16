package com.university.portal.student_portal.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI studentPortalOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Student Portal API")
                        .version("1.0")
                        .description("REST API for managing students, courses, and enrollments"));
    }
}
