package com.tallerjj.apirest.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Table(name = "user")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private String email;

    private String lastName;
    private String name;
    private String password;
    private boolean state;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_rol",
        joinColumns = @JoinColumn(name = "user_fk"),
        inverseJoinColumns = @JoinColumn(name = "rol_fk")
    )
    private Set<Rol> roles;
} 