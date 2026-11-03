package com.campusdual.cd2026mnd1g4.ws.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    private final boolean openApiGenerationEnabled;

    public SecurityConfig(@Value("${openapi.generation.enabled:false}") boolean openApiGenerationEnabled) {
        this.openApiGenerationEnabled = openApiGenerationEnabled;
    }

    /**
     * Configura seguridad HTTP basica para proteger los endpoints REST.
     *
     * @param http builder de seguridad web
     * @return cadena de filtros configurada
     */
    @Bean
    @Order(1)
    public SecurityFilterChain swaggerSecurityFilterChain(HttpSecurity http) {
        try {
            http
                    .securityMatcher(
                            "/swagger-ui.html",
                            "/swagger-ui/**",
                            "/v3/api-docs",
                            "/v3/api-docs/**",
                            "/openapi-copilot.yaml",
                            "/h2-console",
                            "/h2-console/**"
                    )
                    .csrf(AbstractHttpConfigurer::disable)
                    .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin()))
                    .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
            return http.build();
        } catch (Exception exception) {
            throw new SecurityConfigurationException("Error al construir la configuracion de seguridad de Swagger", exception);
        }
    }

    /**
     * Configura seguridad HTTP basica para proteger los endpoints REST.
     *
     * @param http builder de seguridad web
     * @return cadena de filtros configurada
     */
    @Bean
    @Order(2)
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        try {
            if (this.openApiGenerationEnabled) {
                http
                        .csrf(AbstractHttpConfigurer::disable)
                        .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
                return http.build();
            }
            http
                    // CSRF se desactiva temporalmente hasta definir el flujo final de autenticacion.
                    .csrf(AbstractHttpConfigurer::disable)
                    .authorizeHttpRequests(auth -> auth
                            .requestMatchers("/error").permitAll()
                            .anyRequest().authenticated())
                    .httpBasic(Customizer.withDefaults());
            return http.build();
        } catch (Exception exception) {
            throw new SecurityConfigurationException("Error al construir la configuracion de seguridad", exception);
        }
    }

    /**
     * Define el codificador de contrasenas usado por la aplicacion.
     *
     * @return codificador BCrypt
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
