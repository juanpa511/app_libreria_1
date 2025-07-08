package com.tallerjj.apirest.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;
import java.util.List;

@Entity
@Table(name = "user")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @Column(length = 255)
    private String email;

    private String lastName;
    private String name;
    private String password;
    private boolean state;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_rol",
        joinColumns = @JoinColumn(name = "user_fk", referencedColumnName = "email"),
        inverseJoinColumns = @JoinColumn(name = "rol_fk", referencedColumnName = "id_rol")
    )
    private Set<Rol> roles;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Booking> bookings;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Fine> fines;
} 