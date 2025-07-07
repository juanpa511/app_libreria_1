package com.tallerjj.apirest.controller;

import com.tallerjj.apirest.entity.Book;
import com.tallerjj.apirest.entity.CopyBook;
import com.tallerjj.apirest.repository.BookRepository;
import com.tallerjj.apirest.repository.CopyBookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/book")
@CrossOrigin(origins = "*")
public class BookController {

    @Autowired
    private BookRepository bookRepository;
    
    @Autowired
    private CopyBookRepository copyBookRepository;

    // ===================== PUBLIC ENDPOINTS =====================

    /**
     * Obtiene todos los libros (PÚBLICO)
     * GET /api/book/all
     * @return lista de todos los libros
     */
    @GetMapping("/all")
    public ResponseEntity<List<Book>> getAllBooks() {
        List<Book> books = bookRepository.findAll();
        return ResponseEntity.ok(books);
    }

    /**
     * Obtiene libros por tipo (PÚBLICO)
     * GET /api/book/all/{type}
     * @param type tipo de libro
     * @return lista de libros del tipo especificado
     */
    @GetMapping("/all/{type}")
    public ResponseEntity<List<Book>> getBooksByType(@PathVariable String type) {
        List<Book> books = bookRepository.findByType(type);
        return ResponseEntity.ok(books);
    }

    // ===================== ADMIN ENDPOINTS =====================

    /**
     * Crea un nuevo libro (ADMIN)
     * POST /api/book/new
     * @param book datos del libro a crear (incluye image64)
     * @return libro creado
     */
    @PostMapping("/new")
    public ResponseEntity<Book> createBook(@RequestBody Book book) {
        // Validar que el libro tenga los campos requeridos
        if (book.getTitle() == null || book.getTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        if (book.getAuthor() == null || book.getAuthor().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        if (book.getType() == null || book.getType().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // Guardar el libro
        Book savedBook = bookRepository.save(book);
        
        // Crear automáticamente una copia del libro
        CopyBook copyBook = new CopyBook();
        copyBook.setBookFk(savedBook.getIdBook());
        copyBook.setState(true); // state: 1 (disponible)
        copyBookRepository.save(copyBook);
        
        return ResponseEntity.ok(savedBook);
    }

    /**
     * Busca libros por título (ADMIN)
     * GET /api/book/find/{title}
     * @param title título a buscar
     * @return lista de libros que coinciden con el título
     */
    @GetMapping("/find/{title}")
    public ResponseEntity<List<Book>> findBooksByTitle(@PathVariable String title) {
        List<Book> books = bookRepository.findByTitleContainingIgnoreCase(title);
        return ResponseEntity.ok(books);
    }

    /**
     * Crea un nuevo ejemplar (ADMIN)
     * POST /api/book/newcopy
     * @param copyBook datos del ejemplar a crear
     * @return ejemplar creado
     */
    @PostMapping("/newcopy")
    public ResponseEntity<CopyBook> createCopyBook(@RequestBody CopyBook copyBook) {
        // Validar que se proporcione el bookFk
        if (copyBook.getBookFk() == null) {
            return ResponseEntity.badRequest().build();
        }
        
        // Verificar que el libro existe
        Optional<Book> bookOpt = bookRepository.findById(copyBook.getBookFk());
        if (bookOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // Establecer el estado por defecto
        copyBook.setState(true);
        
        // Guardar la copia
        CopyBook savedCopyBook = copyBookRepository.save(copyBook);
        return ResponseEntity.ok(savedCopyBook);
    }

    /**
     * Obtiene ejemplares de un libro por título (ADMIN)
     * GET /api/book/copy/{title}
     * @param title título del libro
     * @return lista de ejemplares del libro
     */
    @GetMapping("/copy/{title}")
    public ResponseEntity<List<CopyBook>> getCopyBooksByTitle(@PathVariable String title) {
        // Buscar el libro por título
        List<Book> books = bookRepository.findByTitleContainingIgnoreCase(title);
        if (books.isEmpty()) {
            return ResponseEntity.ok(new ArrayList<>());
        }
        
        // Obtener todas las copias de los libros encontrados
        List<CopyBook> allCopies = new ArrayList<>();
        for (Book book : books) {
            List<CopyBook> copies = copyBookRepository.findByBookFk(book.getIdBook());
            allCopies.addAll(copies);
        }
        
        return ResponseEntity.ok(allCopies);
    }
} 