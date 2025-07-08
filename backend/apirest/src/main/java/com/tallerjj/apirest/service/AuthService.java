package com.tallerjj.apirest.service;

import com.tallerjj.apirest.dto.AuthResponse;
import com.tallerjj.apirest.dto.LoginRequest;
import com.tallerjj.apirest.dto.RegisterRequest;
import com.tallerjj.apirest.entity.Rol;
import com.tallerjj.apirest.entity.User;
import com.tallerjj.apirest.repository.RolRepository;
import com.tallerjj.apirest.repository.UserRepository;
import com.tallerjj.apirest.security.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    /**
     * Registra un nuevo usuario con rol LECTOR
     * @param request datos del usuario a registrar
     * @return respuesta con token JWT
     */
    public AuthResponse register(RegisterRequest request) {
        // Verificar si el usuario ya existe
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El usuario con email " + request.getEmail() + " ya existe");
        }

        // Crear nuevo usuario
        User user = new User();
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setLastName(request.getLastName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setState(true); // Usuario activo por defecto

        // Asignar rol LECTOR
        Set<Rol> roles = new HashSet<>();
        Optional<Rol> lectorRole = rolRepository.findByName("LECTOR");
        if (lectorRole.isPresent()) {
            roles.add(lectorRole.get());
        } else {
            // Si no existe el rol LECTOR, lo creamos
            Rol newLectorRole = new Rol();
            newLectorRole.setName("LECTOR");
            roles.add(rolRepository.save(newLectorRole));
        }
        user.setRoles(roles);

        // Guardar usuario
        user = userRepository.save(user);

        // Generar token JWT
        String token = jwtProvider.generateToken(user.getEmail());
        String roleName = "LECTOR";
        return new AuthResponse(token, "Usuario registrado exitosamente", user.getEmail(), roleName);
    }

    /**
     * Autentica un usuario y genera token JWT
     * @param request credenciales de login
     * @return respuesta con token JWT
     */
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // Consulta nativa para obtener el rol
            List<Rol> rolesNativos = userRepository.findRolesByUserEmail(request.getEmail());
            if (rolesNativos.isEmpty()) {
                throw new RuntimeException("El usuario no tiene rol asignado");
            }
            String roleName = rolesNativos.get(0).getName();

            String token = jwtProvider.generateToken(request.getEmail());

            return new AuthResponse(token, "Login exitoso", request.getEmail(), roleName);
        } catch (Exception e) {
            return new AuthResponse(null, "Credenciales inválidas", null, null);
        }
    }
} 