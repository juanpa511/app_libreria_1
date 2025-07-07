package com.tallerjj.apirest.repository;

import com.tallerjj.apirest.entity.Fine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FineRepository extends JpaRepository<Fine, Long> {
    
    // TODO: Implementar cuando se necesite
    // List<Fine> findByUserEmail(String email);
    // List<Fine> findByUserEmailAndStateTrue(String email);
} 