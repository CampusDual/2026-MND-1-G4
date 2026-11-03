package com.campusdual.cd2026mnd1g4.model.repository;

import com.campusdual.cd2026mnd1g4.model.entity.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<RoleEntity, Long> {

    /**
     * Busca un rol por su nombre.
     *
     * @param name nombre del rol
     * @return rol encontrado si existe
     */
    Optional<RoleEntity> findByName(String name);

    /**
     * Comprueba si existe un rol por su nombre.
     *
     * @param name nombre del rol
     * @return true si existe
     */
    boolean existsByName(String name);
}

