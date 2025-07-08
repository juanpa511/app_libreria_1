package com.tallerjj.apirest.controller;

import com.tallerjj.apirest.entity.Fine;
import com.tallerjj.apirest.entity.User;
import com.tallerjj.apirest.repository.FineRepository;
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
@RequestMapping("/fine")
@CrossOrigin(origins = "*")
public class FineController {

    @Autowired
    private FineRepository fineRepository;

    @Autowired
    private UserRepository userRepository;

    // ===================== ADMIN ENDPOINTS =====================

    /**
     * Obtiene todas las multas (solo ADMIN)
     * GET /api/fine/all
     * @return lista de todas las multas
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllFines() {
        try {
            // Verificar si es ADMIN
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
            
            if (!isAdmin) {
                return ResponseEntity.status(403).body("Solo los administradores pueden ver todas las multas");
            }
            
            List<Fine> fines = fineRepository.findAll();
            return ResponseEntity.ok(fines);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al obtener multas: " + e.getMessage());
        }
    }

    /**
     * Crea una nueva multa (solo ADMIN)
     * POST /api/fine/new
     * @param fineData datos de la multa
     * @return multa creada
     */
    @PostMapping("/new")
    public ResponseEntity<?> createFine(@RequestBody Fine fineData) {
        try {
            // Verificar si es ADMIN
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
            
            if (!isAdmin) {
                return ResponseEntity.status(403).body("Solo los administradores pueden crear multas");
            }
            
            // Validar que el usuario existe
            if (fineData.getUser() == null || fineData.getUser().getEmail() == null) {
                return ResponseEntity.badRequest().body("Usuario es requerido");
            }
            
            Optional<User> userOpt = userRepository.findById(fineData.getUser().getEmail());
            if (!userOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Usuario no encontrado");
            }
            
            fineData.setUser(userOpt.get());
            fineData.setState(false); // Por defecto, la multa está pendiente
            
            Fine savedFine = fineRepository.save(fineData);
            return ResponseEntity.ok(savedFine);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al crear multa: " + e.getMessage());
        }
    }

    /**
     * Actualiza una multa (solo ADMIN)
     * PUT /api/fine/{id}
     * @param id ID de la multa
     * @param fineData datos actualizados
     * @return multa actualizada
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateFine(@PathVariable Integer id, @RequestBody Fine fineData) {
        try {
            // Verificar si es ADMIN
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
            
            if (!isAdmin) {
                return ResponseEntity.status(403).body("Solo los administradores pueden actualizar multas");
            }
            
            Optional<Fine> fineOpt = fineRepository.findById(id);
            if (!fineOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            Fine existingFine = fineOpt.get();
            existingFine.setAmount(fineData.getAmount());
            existingFine.setDescription(fineData.getDescription());
            existingFine.setState(fineData.getState());
            
            Fine updatedFine = fineRepository.save(existingFine);
            return ResponseEntity.ok(updatedFine);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar multa: " + e.getMessage());
        }
    }

    /**
     * Paga una multa (ADMIN o el propio usuario)
     * PUT /api/fine/{id}/pay
     * @param id ID de la multa
     * @return multa pagada
     */
    @PutMapping("/{id}/pay")
    public ResponseEntity<?> payFine(@PathVariable Integer id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUserEmail = authentication.getName();
            boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
            
            Optional<Fine> fineOpt = fineRepository.findById(id);
            if (!fineOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            Fine fine = fineOpt.get();
            
            // Verificar permisos: solo ADMIN o el propio usuario puede pagar
            if (!isAdmin && !fine.getUser().getEmail().equals(currentUserEmail)) {
                return ResponseEntity.status(403).body("No tienes permisos para pagar esta multa");
            }
            
            fine.setState(true); // Marcar como pagada
            Fine paidFine = fineRepository.save(fine);
            return ResponseEntity.ok(paidFine);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al pagar multa: " + e.getMessage());
        }
    }

    /**
     * Elimina una multa (solo ADMIN)
     * DELETE /api/fine/{id}
     * @param id ID de la multa
     * @return confirmación
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFine(@PathVariable Integer id) {
        try {
            // Verificar si es ADMIN
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
            
            if (!isAdmin) {
                return ResponseEntity.status(403).body("Solo los administradores pueden eliminar multas");
            }
            
            Optional<Fine> fineOpt = fineRepository.findById(id);
            if (!fineOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            fineRepository.deleteById(id);
            return ResponseEntity.ok("Multa eliminada exitosamente");
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al eliminar multa: " + e.getMessage());
        }
    }

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
            
            // Verificar si es ADMIN o LECTOR
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
            boolean isLector = authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_LECTOR"));
            
            // Debug logs
            System.out.println("=== DEBUG FINE CONTROLLER ===");
            System.out.println("Email solicitado: " + email);
            System.out.println("Usuario autenticado: " + currentUserEmail);
            System.out.println("Es admin: " + isAdmin);
            System.out.println("Es lector: " + isLector);
            System.out.println("Authorities: " + authentication.getAuthorities());
            System.out.println("=============================");
            
            // Si es LECTOR, solo puede ver sus propias multas
            if (isLector && !currentUserEmail.equals(email)) {
                return ResponseEntity.status(403).body("No tienes permisos para ver multas de otros usuarios. Tu email: " + currentUserEmail + ", Email solicitado: " + email);
            }
            
            // Si no es ni ADMIN ni LECTOR, no tiene permisos
            if (!isAdmin && !isLector) {
                return ResponseEntity.status(403).body("No tienes permisos para acceder a este recurso");
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