package com.tallerjj.apirest.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "fine")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Fine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idFine;

    private int amount;
    private String description;
    private boolean state;

    @ManyToOne
    @JoinColumn(name = "user")
    private User user;
} 