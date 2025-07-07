package com.tallerjj.apirest.controller;

import com.tallerjj.apirest.entity.Booking;
import com.tallerjj.apirest.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/booking")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    // ===================== ADMIN ENDPOINTS =====================

    /**
     * Crea una nueva reserva (ADMIN)
     * POST /api/booking/new
     * @param booking datos de la reserva
     * @return reserva creada
     */
    @PostMapping("/new")
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        Booking savedBooking = bookingRepository.save(booking);
        return ResponseEntity.ok(savedBooking);
    }

    /**
     * Busca reservas por email (ADMIN)
     * GET /api/booking/find/{email}
     * @param email email del usuario
     * @return lista de reservas del usuario
     */
    @GetMapping("/find/{email}")
    public ResponseEntity<List<Booking>> findBookingsByEmail(@PathVariable String email) {
        // TODO: Implementar búsqueda por email
        List<Booking> bookings = bookingRepository.findAll();
        return ResponseEntity.ok(bookings);
    }

    /**
     * Procesa la devolución de un libro (ADMIN)
     * POST /api/booking/return/{idBooking}
     * @param idBooking ID de la reserva
     * @param returnData datos de la devolución
     * @return confirmación de devolución
     */
    @PostMapping("/return/{idBooking}")
    public ResponseEntity<String> returnBook(@PathVariable Long idBooking, @RequestBody Object returnData) {
        // TODO: Implementar lógica de devolución
        return ResponseEntity.ok("Libro devuelto exitosamente");
    }

    // ===================== LECTOR ENDPOINTS =====================

    /**
     * Obtiene mis préstamos (LECTOR)
     * GET /api/booking/find/{email}
     * @param email email del usuario
     * @return lista de préstamos del usuario
     */
    // Este endpoint es el mismo que el de ADMIN, se maneja con roles
} 