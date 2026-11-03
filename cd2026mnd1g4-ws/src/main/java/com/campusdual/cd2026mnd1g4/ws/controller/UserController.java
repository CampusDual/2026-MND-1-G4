package com.campusdual.cd2026mnd1g4.ws.controller;

import com.campusdual.cd2026mnd1g4.api.dto.UserDto;
import com.campusdual.cd2026mnd1g4.api.dto.UserUpsertRequestDto;
import com.campusdual.cd2026mnd1g4.api.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Validated
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Recupera todos los usuarios del sistema.
     *
     * @return lista de usuarios
     */
    @GetMapping
    public ResponseEntity<List<UserDto>> getAll() {
        return ResponseEntity.ok(this.userService.findAll());
    }

    /**
     * Recupera un usuario por su identificador.
     *
     * @param id identificador del usuario
     * @return usuario encontrado
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(this.userService.findById(id));
    }

    /**
     * Crea un nuevo usuario.
     *
     * @param userRequest datos del usuario a crear
     * @return usuario creado
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> create(@Valid @RequestBody UserUpsertRequestDto userRequest) {
        UserDto createdUser = this.userService.create(userRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    /**
     * Actualiza un usuario existente.
     *
     * @param id identificador del usuario
     * @param userRequest nuevos datos del usuario
     * @return usuario actualizado
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> update(@PathVariable Long id, @Valid @RequestBody UserUpsertRequestDto userRequest) {
        return ResponseEntity.ok(this.userService.update(id, userRequest));
    }

    /**
     * Elimina un usuario por su identificador.
     *
     * @param id identificador del usuario
     * @return respuesta vacia con codigo 204
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        this.userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

