package com.tallerjj.apirest.controller;

import com.tallerjj.apirest.entity.Fine;
import com.tallerjj.apirest.repository.FineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fine")
@CrossOrigin(origins = "*")
public class FineController {

    @Autowired
    private FineRepository fineRepository;

    // ===================== ADMIN ENDPOINTS =====================

    /**
     * Busca multas por email
     * GET /api/fine/find/{email}
     * ADMIN: puede ver multas de cualquier usuario
     * LECTOR: solo puede ver sus propias multas
     * @param email email del usuario
     * @return lista de multas del usuario
     */
    @GetMapping("/find/{email}")
    public ResponseEntity<?> findFinesByEmail(@PathVariable String email) {
        try {
            // Obtener información del usuario autenticado
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUserEmail = authentication.getName();
            boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
            
            // Debug logs
            System.out.println("=== DEBUG FINE CONTROLLER ===");
            System.out.println("Email solicitado: " + email);
            System.out.println("Usuario autenticado: " + currentUserEmail);
            System.out.println("Es admin: " + isAdmin);
            System.out.println("Authorities: " + authentication.getAuthorities());
            System.out.println("=============================");
            
            // Si es LECTOR, solo puede ver sus propias multas
            if (!isAdmin && !currentUserEmail.equals(email)) {
                return ResponseEntity.status(403).body("No tienes permisos para ver multas de otros usuarios. Tu email: " + currentUserEmail + ", Email solicitado: " + email);
            }
            
            // Buscar multas por email
            List<Fine> fines = fineRepository.findByUserEmail(email);
            return ResponseEntity.ok(fines);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al buscar multas: " + e.getMessage());
        }
    }

    // ===================== LECTOR ENDPOINTS =====================

    /**
     * Obtiene mis multas (LECTOR)
     * GET /api/fine/find/{email}
     * @param email email del usuario
     * @return lista de multas del usuario
     */
    // Este endpoint es el mismo que el de ADMIN, se maneja con roles
} 