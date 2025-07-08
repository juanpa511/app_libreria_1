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
        user.setUserVersion(System.currentTimeMillis()); // Versión inicial

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

        // Generar token JWT con versión de usuario
        String token = jwtProvider.generateToken(user.getEmail(), user.getUserVersion());

        // Obtener el ID del primer rol (asumiendo que un usuario tiene al menos un rol)
        Integer rolId = user.getRoles().iterator().next().getIdRol();

        return new AuthResponse(token, "Usuario registrado exitosamente", user.getEmail(), rolId);
    }

    /**
     * Autentica un usuario y genera token JWT
     * @param request credenciales de login
     * @return respuesta con token JWT
     */
    public AuthResponse login(LoginRequest request) {
        try {
            // Autenticar usuario
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // Obtener el usuario para acceder a sus roles
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Generar token JWT con versión de usuario
            String token = jwtProvider.generateToken(request.getEmail(), user.getUserVersion());

            // Obtener el ID del primer rol (asumiendo que un usuario tiene al menos un rol)
            Integer rolId = user.getRoles().iterator().next().getIdRol();

            return new AuthResponse(token, "Login exitoso", request.getEmail(), rolId);
        } catch (Exception e) {
            throw new RuntimeException("Credenciales inválidas");
        }
    }

    /**
     * Refresca el token JWT de un usuario
     * @param email el email del usuario
     * @return respuesta con nuevo token JWT
     */
    public AuthResponse refreshToken(String email) {
        // Obtener el usuario
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar que el usuario esté activo
        if (!user.isState()) {
            throw new RuntimeException("Usuario inactivo");
        }

        // Generar nuevo token JWT con versión actualizada
        String token = jwtProvider.generateToken(email, user.getUserVersion());

        // Obtener el ID del primer rol
        Integer rolId = user.getRoles().iterator().next().getIdRol();

        return new AuthResponse(token, "Token refrescado exitosamente", email, rolId);
    }
} 