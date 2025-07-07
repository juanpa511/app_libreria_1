package com.tallerjj.apirest.repository;

import com.tallerjj.apirest.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {
    
    /**
     * Busca libros por título (ignorando mayúsculas/minúsculas)
     * @param title título a buscar
     * @return lista de libros que contienen el título
     */
    List<Book> findByTitleContainingIgnoreCase(String title);
    
    /**
     * Busca libros por autor (ignorando mayúsculas/minúsculas)
     * @param author autor a buscar
     * @return lista de libros del autor
     */
    List<Book> findByAuthorContainingIgnoreCase(String author);
    
    /**
     * Busca libros por tipo
     * @param type tipo a buscar
     * @return lista de libros del tipo
     */
    List<Book> findByType(String type);
} 