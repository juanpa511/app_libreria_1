package com.tallerjj.apirest.service;

import com.tallerjj.apirest.entity.Book;
import com.tallerjj.apirest.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    /**
     * Obtiene todos los libros
     * @return lista de todos los libros
     */
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    /**
     * Obtiene libros por tipo
     * @param type el tipo de libro
     * @return lista de libros del tipo especificado
     */
    public List<Book> getBooksByType(String type) {
        return bookRepository.findByType(type);
    }

    /**
     * Obtiene un libro por su ID
     * @param id el ID del libro
     * @return Optional con el libro si existe
     */
    public Optional<Book> getBookById(Integer id) {
        return bookRepository.findById(id);
    }

    /**
     * Obtiene libros por autor
     * @param author el autor del libro
     * @return lista de libros del autor especificado
     */
    public List<Book> getBooksByAuthor(String author) {
        return bookRepository.findByAuthorContainingIgnoreCase(author);
    }

    /**
     * Busca libros por título
     * @param title el título del libro
     * @return lista de libros que contengan el título especificado
     */
    public List<Book> searchBooksByTitle(String title) {
        return bookRepository.findByTitleContainingIgnoreCase(title);
    }

    /**
     * Guarda un nuevo libro
     * @param book el libro a guardar
     * @return el libro guardado
     */
    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }

    /**
     * Actualiza un libro existente
     * @param book el libro a actualizar
     * @return el libro actualizado
     */
    public Book updateBook(Book book) {
        return bookRepository.save(book);
    }

    /**
     * Elimina un libro por su ID
     * @param id el ID del libro a eliminar
     */
    public void deleteBook(Integer id) {
        bookRepository.deleteById(id);
    }
} 