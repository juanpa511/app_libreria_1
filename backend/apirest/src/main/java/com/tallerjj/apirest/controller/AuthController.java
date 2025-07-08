package com.tallerjj.apirest.controller;

import com.tallerjj.apirest.dto.AuthResponse;
import com.tallerjj.apirest.dto.LoginRequest;
import com.tallerjj.apirest.dto.RegisterRequest;
import com.tallerjj.apirest.service.AuthService;
import com.tallerjj.apirest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Registra un nuevo usuario
     * POST /api/auth/register
     * @param request datos del usuario a registrar
     * @return respuesta con token JWT
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, e.getMessage(), null, null));
        }
    }

    /**
     * Autentica un usuario
     * POST /api/auth/login
     * @param request credenciales de login
     * @return respuesta con token JWT
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.out.println("Error en login: " + e.getMessage());
            AuthResponse errorResponse = new AuthResponse(null, null, null, null);
            errorResponse.setToken(null);
            errorResponse.setMessage(e.getMessage());
            errorResponse.setEmail(null);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Endpoint de prueba para verificar que el controlador funciona
     * GET /api/auth/test
     * @return mensaje de prueba
     */
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("AuthController funcionando correctamente");
    }

    /**
     * Endpoint de prueba para crear un usuario de prueba
     * POST /api/auth/create-test-user
     * @return respuesta con token JWT
     */
    @PostMapping("/create-test-user")
    public ResponseEntity<AuthResponse> createTestUser() {
        try {
            RegisterRequest request = new RegisterRequest();
            request.setEmail("test@example.com");
            request.setPassword("password123");
            request.setName("Usuario");
            request.setLastName("Prueba");
            
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, e.getMessage(), null, null));
        }
    }

    /**
     * Endpoint de prueba para verificar login con debug
     * POST /api/auth/debug-login
     * @param request credenciales de login
     * @return respuesta con información de debug
     */
    @PostMapping("/debug-login")
    public ResponseEntity<?> debugLogin(@RequestBody LoginRequest request) {
        try {
            System.out.println("=== DEBUG LOGIN ===");
            System.out.println("Email recibido: " + request.getEmail());
            System.out.println("Password recibido: " + request.getPassword());
            
            // Verificar si el usuario existe
            var userOpt = userRepository.findByEmailWithRoles(request.getEmail());
            if (userOpt.isPresent()) {
                var user = userOpt.get();
                System.out.println("Usuario encontrado: " + user.getEmail());
                System.out.println("Password en BD: " + user.getPassword());
                System.out.println("Estado: " + user.isState());
                System.out.println("Roles cargados: " + (user.getRoles() != null ? "SÍ" : "NO"));
                if (user.getRoles() != null) {
                    System.out.println("Número de roles: " + user.getRoles().size());
                    System.out.println("Roles: " + user.getRoles().stream().map(r -> r.getName()).collect(java.util.stream.Collectors.toList()));
                } else {
                    System.out.println("La colección de roles es NULL");
                }
            } else {
                System.out.println("Usuario NO encontrado");
                return ResponseEntity.badRequest()
                        .body(new AuthResponse(null, "Usuario no encontrado", null, null));
            }
            
            // Intentar autenticación
            AuthResponse response = authService.login(request);
            System.out.println("Login exitoso");
            System.out.println("==================");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Error en login: " + e.getMessage());
            System.out.println("Tipo de error: " + e.getClass().getSimpleName());
            e.printStackTrace();
            System.out.println("==================");
            
            AuthResponse errorResponse = new AuthResponse(null, null, null, null);
            errorResponse.setToken(null);
            errorResponse.setMessage(e.getMessage() != null ? e.getMessage() : "Error desconocido en autenticación");
            errorResponse.setEmail(null);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
} 