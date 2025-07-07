package com.tallerjj.apirest.controller;

import com.tallerjj.apirest.entity.User;
import com.tallerjj.apirest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reader")
@CrossOrigin(origins = "*")
public class ReaderController {

    @Autowired
    private UserRepository userRepository;

    // ===================== ADMIN ENDPOINTS =====================

    /**
     * Busca un lector por email (ADMIN)
     * GET /api/reader/find/{email}
     * @param email email del lector
     * @return datos del lector
     */
    @GetMapping("/find/{email}")
    public ResponseEntity<User> findReaderByEmail(@PathVariable String email) {
        return userRepository.findById(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Cambia el estado de un lector (ADMIN)
     * POST /api/reader/state/{email}
     * @param email email del lector
     * @param stateData datos del estado
     * @return confirmación del cambio de estado
     */
    @PostMapping("/state/{email}")
    public ResponseEntity<String> changeReaderState(@PathVariable String email, @RequestBody Object stateData) {
        // TODO: Implementar lógica para cambiar estado del lector
        return ResponseEntity.ok("Estado del lector actualizado exitosamente");
    }

    
} 