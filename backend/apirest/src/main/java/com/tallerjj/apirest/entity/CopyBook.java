package com.tallerjj.apirest.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_fk", insertable = false, updatable = false)
    private Book book;

    @Column(name = "state", columnDefinition = "bit(1) default 1")
    private boolean state = true;

    @OneToMany(mappedBy = "copyBook", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Booking> bookings;
} 