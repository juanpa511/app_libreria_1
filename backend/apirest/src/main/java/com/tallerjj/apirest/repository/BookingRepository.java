package com.tallerjj.apirest.repository;

import com.tallerjj.apirest.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    /**
     * Busca todas las reservas de un usuario por su email
     * @param email email del usuario
     * @return lista de reservas del usuario
     */
    List<Booking> findByUserEmail(String email);
    
    /**
     * Busca reservas activas de un usuario por su email
     * @param email email del usuario
     * @return lista de reservas activas del usuario
     */
    List<Booking> findByUserEmailAndStateTrue(String email);
} 