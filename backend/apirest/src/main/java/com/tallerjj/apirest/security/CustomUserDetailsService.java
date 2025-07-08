package com.tallerjj.apirest.security;

import com.tallerjj.apirest.entity.User;
import com.tallerjj.apirest.entity.Rol;
import com.tallerjj.apirest.repository.UserRepository;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmailWithRoles(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));

        if (!user.isState()) {
            throw new UsernameNotFoundException("Usuario inactivo: " + email);
        }

        Set<Rol> rolesCopy = user.getRoles() != null ? Set.copyOf(user.getRoles()) : Set.of();
        List<SimpleGrantedAuthority> authorities = rolesCopy.stream()
                .map(rol -> new SimpleGrantedAuthority("ROLE_" + rol.getName().toUpperCase()))
                .toList();

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