package com.tallerjj.apirest.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_rol")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_email")
    private User user;

    @ManyToOne
    @JoinColumn(name = "rol_id_rol")
    private Rol rol;
} 