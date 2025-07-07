package com.tallerjj.apirest.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "book")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idBook;

    @Column(nullable = false)
    private String author;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private String type;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] image64;

    @OneToMany(mappedBy = "book", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<CopyBook> copyBooks;
} 