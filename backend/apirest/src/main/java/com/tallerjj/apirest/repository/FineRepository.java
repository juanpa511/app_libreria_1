package com.tallerjj.apirest.repository;

import com.tallerjj.apirest.entity.Fine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FineRepository extends JpaRepository<Fine, Integer> {
    
    /**
     * Busca todas las multas de un usuario por su email
     * @param email email del usuario
     * @return lista de multas del usuario
     */
    List<Fine> findByUserEmail(String email);
    
    /**
     * Busca multas activas de un usuario por su email
     * @param email email del usuario
     * @return lista de multas activas del usuario
     */
    List<Fine> findByUserEmailAndStateTrue(String email);
} 