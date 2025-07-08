package com.tallerjj.apirest.security;

import com.tallerjj.apirest.entity.User;
import com.tallerjj.apirest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));

        // Verificar si el usuario está activo
        if (!user.isState()) {
            throw new UsernameNotFoundException("Usuario inactivo: " + email);
        }

        // Convertir los roles a SimpleGrantedAuthority
        var authorities = user.getRoles().stream()
                .map(rol -> new SimpleGrantedAuthority("ROLE_" + rol.getName().toUpperCase()))
                .collect(Collectors.toList());

        // Log temporal para verificar roles
        System.out.println("=== DEBUG ROLES ===");
        System.out.println("Usuario: " + email);
        System.out.println("Roles encontrados: " + user.getRoles().stream().map(r -> r.getName()).collect(Collectors.toList()));
        System.out.println("Authorities: " + authorities);
        System.out.println("==================");

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities(authorities)
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(!user.isState())
                .build();
    }
} 