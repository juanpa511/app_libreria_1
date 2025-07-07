package com.tallerjj.apirest.controller;

import com.tallerjj.apirest.entity.Fine;
import com.tallerjj.apirest.repository.FineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
     * Busca multas por email (ADMIN)
     * GET /api/fine/find/{email}
     * @param email email del usuario
     * @return lista de multas del usuario
     */
    @GetMapping("/find/{email}")
    public ResponseEntity<List<Fine>> findFinesByEmail(@PathVariable String email) {
        // TODO: Implementar búsqueda por email
        List<Fine> fines = fineRepository.findAll();
        return ResponseEntity.ok(fines);
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