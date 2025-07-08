package com.tallerjj.apirest.controller;

import com.tallerjj.apirest.entity.User;
import com.tallerjj.apirest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<?> findReaderByEmail(@PathVariable String email) {
        try {
            // Verificar permisos de admin
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
            
            if (!isAdmin) {
                return ResponseEntity.status(403).body("No tienes permisos para buscar lectores");
            }
            
            Optional<User> user = userRepository.findById(email);
            if (user.isPresent()) {
                return ResponseEntity.ok(user.get());
            } else {
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al buscar lector: " + e.getMessage());
        }
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

    /**
     * Obtiene todos los usuarios (ADMIN)
     * GET /api/reader/all
     * @return lista de todos los usuarios
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers() {
        try {
            // Verificar permisos de admin
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
            
            if (!isAdmin) {
                return ResponseEntity.status(403).body("No tienes permisos para ver todos los usuarios");
            }
            
            // Obtener todos los usuarios
            List<User> users = userRepository.findAll();
            return ResponseEntity.ok(users);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al obtener usuarios: " + e.getMessage());
        }
    }

    /**
     * Obtiene un usuario por ID (ADMIN)
     * GET /api/reader/{id}
     * @param id ID del usuario
     * @return datos del usuario
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        try {
            // Verificar permisos de admin
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
            
            if (!isAdmin) {
                return ResponseEntity.status(403).body("No tienes permisos para ver usuarios");
            }
            
            Optional<User> user = userRepository.findById(id);
            if (user.isPresent()) {
                return ResponseEntity.ok(user.get());
            } else {
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al obtener usuario: " + e.getMessage());
        }
    }

    /**
     * Obtiene detalles completos de un usuario (ADMIN)
     * GET /api/reader/{id}/details
     * @param id ID del usuario
     * @return detalles completos del usuario
     */
    @GetMapping("/{id}/details")
    public ResponseEntity<?> getUserDetails(@PathVariable String id) {
        try {
            // Verificar permisos de admin
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
            
            if (!isAdmin) {
                return ResponseEntity.status(403).body("No tienes permisos para ver detalles de usuarios");
            }
            
            Optional<User> user = userRepository.findById(id);
            if (user.isPresent()) {
                // Aquí podrías agregar lógica adicional para obtener préstamos, multas, etc.
                return ResponseEntity.ok(user.get());
            } else {
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al obtener detalles del usuario: " + e.getMessage());
        }
    }

    /**
     * Busca usuarios por término (ADMIN)
     * GET /api/reader/search?q={query}
     * @param query término de búsqueda
     * @return lista de usuarios que coinciden
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam String q) {
        try {
            // Verificar permisos de admin
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
            
            if (!isAdmin) {
                return ResponseEntity.status(403).body("No tienes permisos para buscar usuarios");
            }
            
            // Buscar usuarios que coincidan con el término
            List<User> users = userRepository.findAll().stream()
                .filter(user -> 
                    user.getEmail().toLowerCase().contains(q.toLowerCase()) ||
                    (user.getName() != null && user.getName().toLowerCase().contains(q.toLowerCase())) ||
                    (user.getLastName() != null && user.getLastName().toLowerCase().contains(q.toLowerCase()))
                )
                .toList();
            
            return ResponseEntity.ok(users);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al buscar usuarios: " + e.getMessage());
        }
    }

    /**
     * Elimina un usuario (ADMIN)
     * DELETE /api/reader/{id}
     * @param id ID del usuario
     * @return confirmación de eliminación
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        try {
            // Verificar permisos de admin
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
            
            if (!isAdmin) {
                return ResponseEntity.status(403).body("No tienes permisos para eliminar usuarios");
            }
            
            Optional<User> user = userRepository.findById(id);
            if (user.isPresent()) {
                userRepository.deleteById(id);
                return ResponseEntity.ok("Usuario eliminado exitosamente");
            } else {
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al eliminar usuario: " + e.getMessage());
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