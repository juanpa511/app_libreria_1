package com.tallerjj.apirest.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "copy_book")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CopyBook {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_copybook")
    private Integer idCopybook;

    @Column(name = "book_fk")
    private Integer bookFk;

    @Column(name = "state", columnDefinition = "bit(1) default 1")
    private boolean state = true;
} 