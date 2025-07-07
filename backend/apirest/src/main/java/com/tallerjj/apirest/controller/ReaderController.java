package com.tallerjj.apirest.controller;

import com.tallerjj.apirest.entity.User;
import com.tallerjj.apirest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

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
     * @param stateRequest datos del estado
     * @return confirmación del cambio de estado
     */
    @PostMapping("/state/{email}")
    public ResponseEntity<?> changeReaderState(@PathVariable String email, @RequestBody StateRequest stateRequest) {
        try {
            // 1. Verificar que el usuario existe
            Optional<User> userOpt = userRepository.findById(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("El usuario especificado no existe");
            }
            
            User user = userOpt.get();
            
            // 2. Cambiar el estado del usuario
            user.setState(stateRequest.isState());
            
            // 3. Guardar los cambios
            userRepository.save(user);
            
            // 4. Preparar respuesta
            String estado = stateRequest.isState() ? "activo" : "inactivo";
            return ResponseEntity.ok("Estado del lector " + email + " actualizado a " + estado + " exitosamente");
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al cambiar el estado del lector: " + e.getMessage());
        }
    }

    
}

// Clase auxiliar para recibir los datos del estado
class StateRequest {
    private boolean state;
    
    public boolean isState() {
        return state;
    }
    
    public void setState(boolean state) {
        this.state = state;
    }
} 