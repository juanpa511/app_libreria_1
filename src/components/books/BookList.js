import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';
import BookFilter from './BookFilter';
import LoadingSpinner from '../common/LoadingSpinner';
import bookService from '../../services/bookService';
import '../styles/BookList.css'; 

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(12);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await bookService.getAllBooks();
      setBooks(response.data);
      setFilteredBooks(response.data);
    } catch (err) {
      setError('Error al cargar los libros');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filters) => {
    let filtered = [...books];

    // Filtrar por categoría
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(book => 
        book.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Filtrar por disponibilidad
    if (filters.availability && filters.availability !== 'all') {
      filtered = filtered.filter(book => {
        if (filters.availability === 'available') {
          return book.available;
        } else if (filters.availability === 'borrowed') {
          return !book.available;
        }
        return true;
      });
    }

    // Filtrar por búsqueda de texto
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(book =>
        book.title?.toLowerCase().includes(searchLower) ||
        book.author?.toLowerCase().includes(searchLower) ||
        book.isbn?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredBooks(filtered);
    setCurrentPage(1); // Reset pagination
  };

  // Paginación
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="book-list">
      <div className="book-list-header">
        <h2>Catálogo de Libros</h2>
        <p>Explora nuestra colección de {books.length} libros</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <BookFilter onFilter={handleFilter} />

      <div className="book-results">
        <div className="results-info">
          <span>Mostrando {filteredBooks.length} resultados</span>
        </div>

        {currentBooks.length === 0 ? (
          <div className="no-books">
            <p>No se encontraron libros con los criterios seleccionados</p>
          </div>
        ) : (
          <>
            <div className="books-grid">
              {currentBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  Anterior
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookList;