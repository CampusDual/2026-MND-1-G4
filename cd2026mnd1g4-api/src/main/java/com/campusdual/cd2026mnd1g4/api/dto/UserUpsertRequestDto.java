package com.campusdual.cd2026mnd1g4.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.HashSet;
import java.util.Set;

public class UserUpsertRequestDto {

    @NotBlank(message = "El nombre de usuario es obligatorio")
    @Size(max = 80, message = "El nombre de usuario no puede superar 80 caracteres")
    private String username;

    @NotBlank(message = "La contrasena es obligatoria")
    @Size(min = 8, max = 120, message = "La contrasena debe tener entre 8 y 120 caracteres")
    private String password;

    @NotNull(message = "El estado enabled es obligatorio")
    private Boolean enabled;

    @NotEmpty(message = "Debe indicarse al menos un rol")
    private Set<@NotBlank(message = "El nombre del rol no puede estar vacio") String> roles = new HashSet<>();

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles == null ? new HashSet<>() : new HashSet<>(roles);
    }
}

