import React, { useState, useEffect } from 'react';
import BookCard from '../components/books/BookCard';
import BookFilter from '../components/books/BookFilter';
import LoadingSpinner from '../components/common/LoadingSpinner';
import bookService from '../services/bookService';
import Layout from '../components/common/Layout';
import '../styles/BooksPage.css';

const BooksPublicPage = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(12);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await bookService.getAllBooks();
      const booksData = response?.data || [];
      console.log('Libros recibidos en BooksPublicPage:', booksData);
      // Solo libros disponibles
      const availableBooks = booksData.filter(book => book.available === true || book.status?.toLowerCase() === 'disponible');
      setBooks(availableBooks);
      setFilteredBooks(availableBooks);
    } catch (err) {
      setError('Error al cargar los libros');
      setBooks([]);
      setFilteredBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    let filtered = books || [];
    // Filtrar por tipo (type, genre, categoria)
    if (filters.type) {
      filtered = filtered.filter(book => 
        (book.type?.toLowerCase() === filters.type.toLowerCase()) ||
        (book.genre?.toLowerCase() === filters.type.toLowerCase()) ||
        (book.categoria?.toLowerCase() === filters.type.toLowerCase())
      );
    }
    // Filtrar por disponibilidad
    if (filters.availability) {
      if (filters.availability === 'available') {
        filtered = filtered.filter(book => book.available === true || book.estado === true || book.status?.toLowerCase() === 'disponible');
      } else if (filters.availability === 'borrowed') {
        filtered = filtered.filter(book => book.available === false || book.estado === false || book.status?.toLowerCase() === 'prestado');
      }
    }
    // Filtrar por año
    if (filters.year) {
      filtered = filtered.filter(book => 
        book.publicationYear?.toString() === filters.year ||
        book.publishedYear?.toString() === filters.year
      );
    }
    // Filtrar por término de búsqueda (título, autor, isbn, descripcion)
    if (filters.searchTerm && filters.searchTerm.trim()) {
      const search = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(book =>
        (book.title?.toLowerCase().includes(search) ||
        book.titulo?.toLowerCase().includes(search) ||
        book.author?.toLowerCase().includes(search) ||
        book.autor?.toLowerCase().includes(search) ||
        book.isbn?.toLowerCase().includes(search) ||
        book.description?.toLowerCase().includes(search) ||
        book.descripcion?.toLowerCase().includes(search))
      );
    }
    setFilteredBooks(filtered);
    setCurrentPage(1);
  };

  // Paginación
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = (filteredBooks || []).slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil((filteredBooks || []).length / booksPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <Layout>
        <div className="books-page">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="books-page">
          <div className="error-message">
            <h2>Error</h2>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={loadBooks}>
              Reintentar
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="books-page">
        <div className="books-header">
          <div className="books-header-content">
            <div className="books-header-info">
              <h1>Libros Disponibles</h1>
              <p>Explora nuestra colección de libros disponibles para todos los usuarios</p>
            </div>
          </div>
        </div>
        <div className="books-content">
          <div className="books-sidebar">
            <BookFilter onFilterChange={handleFilterChange} />
          </div>
          <div className="books-main">
            <div className="books-results-info">
              <p>Mostrando {currentBooks.length} de {filteredBooks.length} libros</p>
            </div>
            {currentBooks.length === 0 ? (
              <div className="no-books">
                <span className="no-books-icon">📚</span>
                <h3>No se encontraron libros</h3>
                <p>Intenta ajustar tus filtros de búsqueda</p>
              </div>
            ) : (
              <>
                <div className="books-grid">
                  {currentBooks.map(book => (
                    <BookCard
                      key={book.id}
                      book={book}
                      showActions={false}
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ← Anterior
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      className="pagination-btn"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BooksPublicPage; 