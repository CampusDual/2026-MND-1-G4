package com.campusdual.cd2026mnd1g4.ws.security;

import com.campusdual.cd2026mnd1g4.model.entity.RoleEntity;
import com.campusdual.cd2026mnd1g4.model.entity.UserEntity;
import com.campusdual.cd2026mnd1g4.model.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class DatabaseUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public DatabaseUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Carga un usuario de seguridad a partir del nombre de usuario de base de datos.
     *
     * @param username nombre de usuario
     * @return usuario con authorities para Spring Security
     * @throws UsernameNotFoundException si no existe el usuario
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity userEntity = this.userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("No existe el usuario con username " + username));

        Set<GrantedAuthority> authorities = userEntity.getRoles().stream()
                .map(RoleEntity::getName)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());

        return User.withUsername(userEntity.getUsername())
                .password(userEntity.getPassword())
                .authorities(authorities)
                .disabled(!Boolean.TRUE.equals(userEntity.getEnabled()))
                .build();
    }
}


