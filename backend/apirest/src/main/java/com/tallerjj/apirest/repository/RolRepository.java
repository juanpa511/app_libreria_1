package com.tallerjj.apirest.repository;

import com.tallerjj.apirest.entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RolRepository extends JpaRepository<Rol, Integer> {
    
    /**
     * Busca un rol por su nombre
     * @param name el nombre del rol
     * @return Optional con el rol si existe
     */
    Optional<Rol> findByName(String name);
    
    /**
     * Verifica si existe un rol con el nombre especificado
     * @param name el nombre a verificar
     * @return true si existe, false en caso contrario
     */
    boolean existsByName(String name);
} 