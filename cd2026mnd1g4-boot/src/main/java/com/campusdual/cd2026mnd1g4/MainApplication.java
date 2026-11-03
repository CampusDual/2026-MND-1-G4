package com.campusdual.cd2026mnd1g4;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Punto de entrada principal de la aplicacion.
 */
@SpringBootApplication
public class MainApplication {

    /**
     * Arranca el contexto de Spring Boot.
     *
     * @param args argumentos de linea de comandos
     */
    public static void main(String[] args) {
        SpringApplication.run(MainApplication.class, args);
    }
}
