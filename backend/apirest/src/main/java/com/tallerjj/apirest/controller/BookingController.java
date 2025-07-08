package com.tallerjj.apirest.controller;

import com.tallerjj.apirest.entity.Booking;
import com.tallerjj.apirest.entity.CopyBook;
import com.tallerjj.apirest.entity.Fine;
import com.tallerjj.apirest.entity.User;
import com.tallerjj.apirest.repository.BookingRepository;
import com.tallerjj.apirest.repository.CopyBookRepository;
import com.tallerjj.apirest.repository.FineRepository;
import com.tallerjj.apirest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/booking")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private CopyBookRepository copyBookRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private FineRepository fineRepository;

    // ===================== ADMIN ENDPOINTS =====================

    /**
     * Crea una nueva reserva (ADMIN)
     * POST /api/booking/new
     * @param booking datos de la reserva
     * @return reserva creada
     */
    @PostMapping("/new")
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        try {
            // 1. Verificar que la copia del libro esté disponible
            if (booking.getCopyBook() == null || booking.getCopyBook().getIdCopybook() == null) {
                return ResponseEntity.badRequest().body("Debe especificar un ejemplar válido");
            }
            
            Optional<CopyBook> copyBookOpt = copyBookRepository.findById(booking.getCopyBook().getIdCopybook());
            if (copyBookOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("El ejemplar especificado no existe");
            }
            
            CopyBook copyBook = copyBookOpt.get();
            if (!copyBook.isState()) {
                return ResponseEntity.badRequest().body("El ejemplar no está disponible para préstamo");
            }
            
            // 2. Verificar que el lector esté activo
            if (booking.getUser() == null || booking.getUser().getEmail() == null) {
                return ResponseEntity.badRequest().body("Debe especificar un usuario válido");
            }
            
            Optional<User> userOpt = userRepository.findById(booking.getUser().getEmail());
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("El usuario especificado no existe");
            }
            
            User user = userOpt.get();
            if (!user.isState()) {
                return ResponseEntity.badRequest().body("El usuario no está activo");
            }
            
            // 3. Establecer fechas automáticamente (5 días de préstamo)
            booking.setDateBooking(LocalDateTime.now());
            booking.setDateReturn(LocalDateTime.now().plusDays(5));
            
            // 4. Establecer estado del préstamo como activo
            booking.setState(true);
            
            // 5. Guardar la reserva
            Booking savedBooking = bookingRepository.save(booking);
            
            // 6. Actualizar disponibilidad de la copia a no disponible
            copyBook.setState(false);
            copyBookRepository.save(copyBook);
            
            return ResponseEntity.ok(savedBooking);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al crear la reserva: " + e.getMessage());
        }
    }

    /**
     * Obtiene todas las reservas (ADMIN)
     * GET /api/booking/all
     * @return lista de todas las reservas
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllBookings() {
        try {
            // Obtener información del usuario autenticado
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
            
            // Solo admin puede ver todas las reservas
            if (!isAdmin) {
                return ResponseEntity.status(403).body("No tienes permisos para ver todas las reservas");
            }
            
            // Buscar todas las reservas
            List<Booking> bookings = bookingRepository.findAll();
            return ResponseEntity.ok(bookings);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al obtener reservas: " + e.getMessage());
        }
    }

    /**
     * Busca reservas por email
     * GET /api/booking/find/{email}
     * ADMIN: puede ver reservas de cualquier usuario
     * LECTOR: solo puede ver sus propias reservas
     * @param email email del usuario
     * @return lista de reservas del usuario
     */
    @GetMapping("/find/{email}")
    public ResponseEntity<?> findBookingsByEmail(@PathVariable String email) {
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
            System.out.println("=== DEBUG BOOKING CONTROLLER ===");
            System.out.println("Email solicitado: " + email);
            System.out.println("Usuario autenticado: " + currentUserEmail);
            System.out.println("Es admin: " + isAdmin);
            System.out.println("Es lector: " + isLector);
            System.out.println("Authorities: " + authentication.getAuthorities());
            System.out.println("================================");
            
            // Si es LECTOR, solo puede ver sus propias reservas
            if (isLector && !currentUserEmail.equals(email)) {
                return ResponseEntity.status(403).body("No tienes permisos para ver reservas de otros usuarios. Tu email: " + currentUserEmail + ", Email solicitado: " + email);
            }
            
            // Si no es ni ADMIN ni LECTOR, no tiene permisos
            if (!isAdmin && !isLector) {
                return ResponseEntity.status(403).body("No tienes permisos para acceder a este recurso");
            }
            
            // Buscar reservas por email
            List<Booking> bookings = bookingRepository.findByUserEmail(email);
            return ResponseEntity.ok(bookings);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al buscar reservas: " + e.getMessage());
        }
    }

    /**
     * Procesa la devolución de un libro (ADMIN)
     * POST /api/booking/return/{email}
     * @param email email del lector
     * @param returnData datos de la devolución (idBooking)
     * @return confirmación de devolución
     */
    @PostMapping("/return/{email}")
    public ResponseEntity<?> returnBook(@PathVariable String email, @RequestBody ReturnRequest returnData) {
        try {
            // 1. Buscar el préstamo por email del lector
            if (returnData.getIdBooking() == null) {
                return ResponseEntity.badRequest().body("Debe especificar el ID de la reserva");
            }
            
            Optional<Booking> bookingOpt = bookingRepository.findById(returnData.getIdBooking().longValue());
            if (bookingOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("La reserva especificada no existe");
            }
            
            Booking booking = bookingOpt.get();
            
            // Verificar que el préstamo pertenece al usuario
            if (!booking.getUser().getEmail().equals(email)) {
                return ResponseEntity.badRequest().body("La reserva no pertenece al usuario especificado");
            }
            
            // 2. Validar que la fecha esté dentro del rango válido de préstamo
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime dateReturn = booking.getDateReturn();
            
            boolean isLate = now.isAfter(dateReturn);
            int daysLate = 0;
            
            if (isLate) {
                daysLate = (int) ChronoUnit.DAYS.between(dateReturn, now);
            }
            
            // 3. Obtener el usuario y la copia del libro
            User user = booking.getUser();
            CopyBook copyBook = booking.getCopyBook();
            
            // 4. Si está fuera del rango válido, aplicar multa
            if (isLate) {
                // Calcular multa: $1.000 x día
                int fineAmount = daysLate * 1000;
                
                // Crear multa
                Fine fine = new Fine();
                fine.setAmount(fineAmount);
                fine.setDescription("Multa por devolución tardía del libro. Días de retraso: " + daysLate);
                fine.setState(true); // Multa habilitada
                fine.setUser(user);
                
                fineRepository.save(fine);
                
                // Cambiar estado del lector a multado (false)
                user.setState(false);
                userRepository.save(user);
            }
            
            // 5. Actualizar estado de la copia devuelta a disponible (true)
            copyBook.setState(true);
            copyBookRepository.save(copyBook);
            
            // 6. Actualizar estado de la reserva a inactiva (false)
            booking.setState(false);
            bookingRepository.save(booking);
            
            // 7. Preparar respuesta
            String response = "Libro devuelto exitosamente";
            if (isLate) {
                response += ". Se aplicó multa de $" + (daysLate * 1000) + " por " + daysLate + " días de retraso. El usuario ha sido multado.";
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al procesar la devolución: " + e.getMessage());
        }
    }

    // ===================== LECTOR ENDPOINTS =====================

    /**
     * Obtiene mis préstamos (LECTOR)
     * GET /api/booking/find/{email}
     * @param email email del usuario
     * @return lista de préstamos del usuario
     */
    // Este endpoint es el mismo que el de ADMIN, se maneja con roles

    /**
     * Renueva un préstamo (ADMIN)
     * POST /api/booking/renew/{idBooking}
     * @param idBooking ID de la reserva
     * @return confirmación de renovación
     */
    @PostMapping("/renew/{idBooking}")
    public ResponseEntity<?> renewBooking(@PathVariable Long idBooking) {
        try {
            // Verificar permisos de admin
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
            
            if (!isAdmin) {
                return ResponseEntity.status(403).body("No tienes permisos para renovar préstamos");
            }
            
            // Buscar la reserva
            Optional<Booking> bookingOpt = bookingRepository.findById(idBooking);
            if (bookingOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("La reserva especificada no existe");
            }
            
            Booking booking = bookingOpt.get();
            
            // Verificar que el préstamo esté activo
            if (!booking.isState()) {
                return ResponseEntity.badRequest().body("No se puede renovar un préstamo que ya fue devuelto");
            }
            
            // Verificar que no esté vencido
            if (LocalDateTime.now().isAfter(booking.getDateReturn())) {
                return ResponseEntity.badRequest().body("No se puede renovar un préstamo vencido");
            }
            
            // Renovar por 5 días más
            booking.setDateReturn(booking.getDateReturn().plusDays(5));
            bookingRepository.save(booking);
            
            return ResponseEntity.ok("Préstamo renovado exitosamente. Nueva fecha de vencimiento: " + booking.getDateReturn());
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al renovar el préstamo: " + e.getMessage());
        }
    }

    /**
     * Cancela un préstamo (ADMIN)
     * POST /api/booking/cancel/{idBooking}
     * @param idBooking ID de la reserva
     * @return confirmación de cancelación
     */
    @PostMapping("/cancel/{idBooking}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long idBooking) {
        try {
            // Verificar permisos de admin
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
            
            if (!isAdmin) {
                return ResponseEntity.status(403).body("No tienes permisos para cancelar préstamos");
            }
            
            // Buscar la reserva
            Optional<Booking> bookingOpt = bookingRepository.findById(idBooking);
            if (bookingOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("La reserva especificada no existe");
            }
            
            Booking booking = bookingOpt.get();
            
            // Verificar que el préstamo esté activo
            if (!booking.isState()) {
                return ResponseEntity.badRequest().body("No se puede cancelar un préstamo que ya fue devuelto");
            }
            
            // Obtener la copia del libro
            CopyBook copyBook = booking.getCopyBook();
            
            // Actualizar estado de la copia a disponible
            copyBook.setState(true);
            copyBookRepository.save(copyBook);
            
            // Actualizar estado de la reserva a inactiva
            booking.setState(false);
            bookingRepository.save(booking);
            
            return ResponseEntity.ok("Préstamo cancelado exitosamente");
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al cancelar el préstamo: " + e.getMessage());
        }
    }
}

// Clase auxiliar para recibir los datos de devolución
class ReturnRequest {
    private Integer idBooking;
    
    public Integer getIdBooking() {
        return idBooking;
    }
    
    public void setIdBooking(Integer idBooking) {
        this.idBooking = idBooking;
    }
} 