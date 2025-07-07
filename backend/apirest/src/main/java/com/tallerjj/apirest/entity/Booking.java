package com.tallerjj.apirest.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "booking")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idBooking;

    private LocalDateTime dateBooking;
    private LocalDateTime dateReturn;
    private boolean state;

    @ManyToOne
    @JoinColumn(name = "copybook_id_copybook")
    private CopyBook copyBook;

    @ManyToOne
    @JoinColumn(name = "user_email")
    private User user;
} 