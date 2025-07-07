package com.tallerjj.apirest.repository;

import com.tallerjj.apirest.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    // TODO: Implementar cuando se necesite
    // List<Booking> findByUserEmail(String email);
    // List<Booking> findByUserEmailAndDateReturnIsNull(String email);
} 