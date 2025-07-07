package com.tallerjj.apirest.repository;

import com.tallerjj.apirest.entity.CopyBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CopyBookRepository extends JpaRepository<CopyBook, Integer> {
    
    /**
     * Busca copias por ID del libro
     * @param bookId ID del libro
     * @return lista de copias del libro
     */
    List<CopyBook> findByBookFk(Integer bookId);
    
    /**
     * Busca copias disponibles por ID del libro
     * @param bookId ID del libro
     * @return lista de copias disponibles del libro
     */
    List<CopyBook> findByBookFkAndStateTrue(Integer bookId);
} 