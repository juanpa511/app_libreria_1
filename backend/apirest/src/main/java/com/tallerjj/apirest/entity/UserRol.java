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
    @Column(name = "id_rol_user")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_fk")
    private User user;

    @ManyToOne
    @JoinColumn(name = "rol_fk")
    private Rol rol;
} 