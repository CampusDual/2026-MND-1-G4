package com.campusdual.cd2026mnd1g4.ws.controller;

import com.campusdual.cd2026mnd1g4.model.exception.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class RestExceptionHandler {

    private static final ZoneId ERROR_TIMESTAMP_ZONE = ZoneOffset.UTC;

    /**
     * Mapea errores de negocio de recursos no encontrados.
     *
     * @param exception excepcion de negocio
     * @return respuesta HTTP 404
     */
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleUserNotFound(UserNotFoundException exception) {
        return buildErrorResponse(HttpStatus.NOT_FOUND, exception.getMessage());
    }

    /**
     * Mapea errores de permisos insuficientes.
     *
     * @param exception excepcion de acceso denegado
     * @return respuesta HTTP 403
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException exception) {
        return buildErrorResponse(HttpStatus.FORBIDDEN, "No tienes permisos para realizar esta operacion");
    }

    /**
     * Mapea errores de validacion de parametros o payload.
     *
     * @param exception excepcion de validacion
     * @return respuesta HTTP 400
     */
    @ExceptionHandler({IllegalArgumentException.class, MethodArgumentNotValidException.class})
    public ResponseEntity<Map<String, Object>> handleBadRequest(Exception exception) {
        String message = exception.getMessage();
        if (exception instanceof MethodArgumentNotValidException methodArgumentNotValidException) {
            FieldError fieldError = methodArgumentNotValidException.getBindingResult().getFieldError();
            if (fieldError != null && fieldError.getDefaultMessage() != null) {
                message = fieldError.getDefaultMessage();
            }
        }
        return buildErrorResponse(HttpStatus.BAD_REQUEST, message);
    }

    /**
     * Mapea errores inesperados no controlados.
     *
     * @param exception excepcion no controlada
     * @return respuesta HTTP 500
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception exception) {
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno no controlado");
    }

    private ResponseEntity<Map<String, Object>> buildErrorResponse(HttpStatus status, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", OffsetDateTime.now(ERROR_TIMESTAMP_ZONE).toString());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }
}
