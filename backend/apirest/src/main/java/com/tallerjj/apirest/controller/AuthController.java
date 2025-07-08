package com.tallerjj.apirest.controller;

import com.tallerjj.apirest.dto.AuthResponse;
import com.tallerjj.apirest.dto.LoginRequest;
import com.tallerjj.apirest.dto.RegisterRequest;
import com.tallerjj.apirest.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

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
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, e.getMessage(), null, null));
        }
    }

    /**
     * Refresca el token JWT del usuario
     * POST /api/auth/refresh
     * @param request token actual del usuario
     * @return nueva respuesta con token JWT actualizado
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.refreshToken(request.getEmail());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, e.getMessage(), null, null));
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
} 