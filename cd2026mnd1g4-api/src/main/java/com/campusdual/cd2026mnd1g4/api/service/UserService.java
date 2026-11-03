package com.campusdual.cd2026mnd1g4.api.service;

import com.campusdual.cd2026mnd1g4.api.dto.UserDto;
import com.campusdual.cd2026mnd1g4.api.dto.UserUpsertRequestDto;

import java.util.List;

public interface UserService {

    /**
     * Recupera todos los usuarios registrados.
     *
     * @return lista de usuarios
     */
    List<UserDto> findAll();

    /**
     * Recupera un usuario por su identificador.
     *
     * @param id identificador del usuario
     * @return usuario encontrado
     */
    UserDto findById(Long id);

    /**
     * Crea un nuevo usuario en el sistema.
     *
     * @param userRequest datos de alta del usuario
     * @return usuario creado
     */
    UserDto create(UserUpsertRequestDto userRequest);

    /**
     * Actualiza un usuario existente.
     *
     * @param id identificador del usuario
     * @param userRequest nuevos datos del usuario
     * @return usuario actualizado
     */
    UserDto update(Long id, UserUpsertRequestDto userRequest);

    /**
     * Elimina un usuario existente.
     *
     * @param id identificador del usuario
     */
    void delete(Long id);
}

