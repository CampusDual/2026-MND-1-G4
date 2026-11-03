package com.campusdual.cd2026mnd1g4.api.dto;

import java.util.HashSet;
import java.util.Set;

public class UserDto {

    private Long id;
    private String username;
    private Boolean enabled;
    private Set<String> roles = new HashSet<>();

    public UserDto() {
    }

    public UserDto(Long id, String username, Boolean enabled, Set<String> roles) {
        this.id = id;
        this.username = username;
        this.enabled = enabled;
        if (roles != null) {
            this.roles = new HashSet<>(roles);
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

