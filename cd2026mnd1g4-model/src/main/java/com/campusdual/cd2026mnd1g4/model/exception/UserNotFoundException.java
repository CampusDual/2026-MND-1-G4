package com.campusdual.cd2026mnd1g4.model.exception;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(Long id) {
        super("No existe el usuario con id " + id);
    }

    public UserNotFoundException(String username) {
        super("No existe el usuario con username " + username);
    }
}

