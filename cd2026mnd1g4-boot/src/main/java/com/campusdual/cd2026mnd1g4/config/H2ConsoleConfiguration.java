package com.campusdual.cd2026mnd1g4.config;

import org.h2.server.web.JakartaWebServlet;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Registra la consola web de H2 como servlet para entornos locales.
 */
@Configuration
public class H2ConsoleConfiguration {

    /**
     * Publica la consola de H2 en la ruta configurada en propiedades.
     *
     * @param consolePath ruta base de la consola H2
     * @return registro del servlet de consola
     */
    @Bean
    @ConditionalOnProperty(prefix = "spring.h2.console", name = "enabled", havingValue = "true")
    public ServletRegistrationBean<JakartaWebServlet> h2ConsoleServlet(
            @Value("${spring.h2.console.path:/h2-console}") String consolePath
    ) {
        String sanitizedPath = sanitizeConsolePath(consolePath);
        ServletRegistrationBean<JakartaWebServlet> registrationBean =
                new ServletRegistrationBean<>(new JakartaWebServlet(), sanitizedPath, sanitizedPath + "/*");
        registrationBean.setName("H2Console");
        registrationBean.addInitParameter("webAllowOthers", "false");
        registrationBean.addInitParameter("trace", "false");
        return registrationBean;
    }

    private String sanitizeConsolePath(String consolePath) {
        String path = consolePath;
        if (path == null || path.isBlank()) {
            return "/h2-console";
        }
        if (!path.startsWith("/")) {
            path = "/" + path;
        }
        if (path.length() > 1 && path.endsWith("/")) {
            return path.substring(0, path.length() - 1);
        }
        return path;
    }
}
