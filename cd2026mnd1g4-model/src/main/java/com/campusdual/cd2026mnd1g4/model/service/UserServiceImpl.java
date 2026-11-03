package com.campusdual.cd2026mnd1g4.model.service;

import com.campusdual.cd2026mnd1g4.api.dto.UserDto;
import com.campusdual.cd2026mnd1g4.api.dto.UserUpsertRequestDto;
import com.campusdual.cd2026mnd1g4.api.service.UserService;
import com.campusdual.cd2026mnd1g4.model.entity.RoleEntity;
import com.campusdual.cd2026mnd1g4.model.entity.UserEntity;
import com.campusdual.cd2026mnd1g4.model.exception.UserNotFoundException;
import com.campusdual.cd2026mnd1g4.model.repository.RoleRepository;
import com.campusdual.cd2026mnd1g4.model.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> findAll() {
        return this.userRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto findById(Long id) {
        validateId(id);
        UserEntity userEntity = this.userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        return mapToDto(userEntity);
    }

    @Override
    public UserDto create(UserUpsertRequestDto userRequest) {
        validateRequest(userRequest);
        String normalizedUsername = normalizeUsername(userRequest.getUsername());
        if (this.userRepository.existsByUsername(normalizedUsername)) {
            throw new IllegalArgumentException("Ya existe un usuario con ese nombre");
        }

        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(normalizedUsername);
        userEntity.setPassword(this.passwordEncoder.encode(userRequest.getPassword()));
        userEntity.setEnabled(userRequest.getEnabled());
        userEntity.setRoles(resolveRoles(userRequest.getRoles()));

        return mapToDto(this.userRepository.save(userEntity));
    }

    @Override
    public UserDto update(Long id, UserUpsertRequestDto userRequest) {
        validateId(id);
        validateRequest(userRequest);

        UserEntity userEntity = this.userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        String normalizedUsername = normalizeUsername(userRequest.getUsername());
        if (!userEntity.getUsername().equals(normalizedUsername)
                && this.userRepository.existsByUsername(normalizedUsername)) {
            throw new IllegalArgumentException("Ya existe un usuario con ese nombre");
        }

        userEntity.setUsername(normalizedUsername);
        userEntity.setPassword(this.passwordEncoder.encode(userRequest.getPassword()));
        userEntity.setEnabled(userRequest.getEnabled());
        userEntity.setRoles(resolveRoles(userRequest.getRoles()));

        return mapToDto(this.userRepository.save(userEntity));
    }

    @Override
    public void delete(Long id) {
        validateId(id);
        if (!this.userRepository.existsById(id)) {
            throw new UserNotFoundException(id);
        }
        this.userRepository.deleteById(id);
    }

    private UserDto mapToDto(UserEntity userEntity) {
        Set<String> roles = userEntity.getRoles().stream().map(RoleEntity::getName).collect(LinkedHashSet::new, Set::add, Set::addAll);
        return new UserDto(userEntity.getId(), userEntity.getUsername(), userEntity.getEnabled(), roles);
    }

    private Set<RoleEntity> resolveRoles(Set<String> roleNames) {
        Set<RoleEntity> roles = new LinkedHashSet<>();
        for (String roleName : roleNames) {
            String normalizedRole = normalizeRoleName(roleName);
            RoleEntity roleEntity = this.roleRepository.findByName(normalizedRole)
                    .orElseGet(() -> createRole(normalizedRole));
            roles.add(roleEntity);
        }
        return roles;
    }

    private RoleEntity createRole(String roleName) {
        RoleEntity roleEntity = new RoleEntity();
        roleEntity.setName(roleName);
        return this.roleRepository.save(roleEntity);
    }

    private void validateId(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("El id debe ser mayor que cero");
        }
    }

    private void validateRequest(UserUpsertRequestDto userRequest) {
        if (Objects.isNull(userRequest)) {
            throw new IllegalArgumentException("El cuerpo de la peticion no puede ser nulo");
        }
        if (Objects.isNull(userRequest.getUsername()) || userRequest.getUsername().isBlank()) {
            throw new IllegalArgumentException("El nombre de usuario es obligatorio");
        }
        if (Objects.isNull(userRequest.getPassword()) || userRequest.getPassword().isBlank()) {
            throw new IllegalArgumentException("La contrasena es obligatoria");
        }
        if (Objects.isNull(userRequest.getEnabled())) {
            throw new IllegalArgumentException("El estado enabled es obligatorio");
        }
        if (Objects.isNull(userRequest.getRoles()) || userRequest.getRoles().isEmpty()) {
            throw new IllegalArgumentException("Debe indicarse al menos un rol");
        }
    }

    private String normalizeUsername(String username) {
        return username.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizeRoleName(String roleName) {
        if (roleName == null || roleName.isBlank()) {
            throw new IllegalArgumentException("El nombre del rol no puede estar vacio");
        }
        String normalizedRole = roleName.trim().toUpperCase(Locale.ROOT);
        if (!normalizedRole.startsWith("ROLE_")) {
            normalizedRole = "ROLE_" + normalizedRole;
        }
        return normalizedRole;
    }
}

