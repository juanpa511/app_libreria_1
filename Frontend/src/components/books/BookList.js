import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';
import BookFilter from './BookFilter';
import LoadingSpinner from '../common/LoadingSpinner';
import bookService from '../../services/bookService';
import { useAuth } from '../../context/AuthContext';
import '../../styles/BookList.css'; 

const BookList = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(12);
  const [totalBooks, setTotalBooks] = useState(0);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Usar el endpoint público para obtener todos los libros
      const response = await bookService.getAllBooks();
      
      if (response && response.data) {
        const booksData = Array.isArray(response.data) ? response.data : [response.data];
        
        // Para lectores, filtrar solo libros activos/disponibles
        const processedBooks = user && user.role === 'LECTOR' 
          ? booksData.filter(book => book.available || book.estado === true)
          : booksData;
        
        setBooks(processedBooks);
        setFilteredBooks(processedBooks);
        setTotalBooks(processedBooks.length);
      } else {
        setBooks([]);
        setFilteredBooks([]);
        setTotalBooks(0);
      }
    } catch (err) {
      setError('Error al cargar los libros. Por favor, intenta de nuevo.');
      console.error('Error fetching books:', err);
      setBooks([]);
      setFilteredBooks([]);
      setTotalBooks(0);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    let filtered = [...books];

    // Filtrar por tipo
    if (filters.type && filters.type !== '') {
      filtered = filtered.filter(book => 
        book.type?.toLowerCase() === filters.type.toLowerCase() ||
        book.categoria?.toLowerCase() === filters.type.toLowerCase() ||
        book.genero?.toLowerCase() === filters.type.toLowerCase()
      );
    }

    // Filtrar por disponibilidad
    if (filters.availability && filters.availability !== '') {
      filtered = filtered.filter(book => {
        if (filters.availability === 'available') {
          return book.available === true || book.estado === true;
        } else if (filters.availability === 'borrowed') {
          return book.available === false || book.estado === false;
        }
        return true;
      });
    }

    // Filtrar por búsqueda de texto
    if (filters.searchTerm && filters.searchTerm.trim() !== '') {
      const searchLower = filters.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(book =>
        book.title?.toLowerCase().includes(searchLower) ||
        book.titulo?.toLowerCase().includes(searchLower) ||
        book.author?.toLowerCase().includes(searchLower) ||
        book.autor?.toLowerCase().includes(searchLower) ||
        book.isbn?.toLowerCase().includes(searchLower) ||
        book.description?.toLowerCase().includes(searchLower) ||
        book.descripcion?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredBooks(filtered);
    setCurrentPage(1); // Reset pagination
  };

  const handleSearchChange = (searchTerm) => {
    // Esta función se mantiene para compatibilidad, pero la lógica está en handleFilterChange
  };

  // Función para buscar libros por tipo específico (para usar con los endpoints de la API)
  const searchBooksByType = async (type) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await bookService.getBooksByType(type);
      
      if (response && response.data) {
        const booksData = Array.isArray(response.data) ? response.data : [response.data];
        setBooks(booksData);
        setFilteredBooks(booksData);
        setTotalBooks(booksData.length);
      }
    } catch (err) {
      setError(`Error al buscar libros del tipo: ${type}`);
      console.error('Error searching books by type:', err);
    } finally {
      setLoading(false);
    }
  };

  // Paginación
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleRefresh = () => {
    fetchBooks();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="book-list">
      <div className="book-list-header">
        <h2>Catálogo de Libros</h2>
        <p>Explora nuestra colección de {totalBooks} libros</p>
        <button 
          className="btn btn-refresh"
          onClick={handleRefresh}
          disabled={loading}
        >
          Actualizar Catálogo
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={handleRefresh} className="btn btn-retry">
            Reintentar
          </button>
        </div>
      )}

      <BookFilter 
        onFilterChange={handleFilterChange} 
        onSearchChange={handleSearchChange}
      />

      <div className="book-results">
        <div className="results-info">
          <span>
            Mostrando {indexOfFirstBook + 1}-{Math.min(indexOfLastBook, filteredBooks.length)} de {filteredBooks.length} resultados
          </span>
          {user && user.role === 'LECTOR' && (
            <span className="availability-note">
              * Solo se muestran libros disponibles para préstamo
            </span>
          )}
        </div>

        {currentBooks.length === 0 ? (
          <div className="no-books">
            <div className="no-books-icon">📚</div>
            <h3>No se encontraron libros</h3>
            <p>No hay libros que coincidan con los criterios de búsqueda seleccionados</p>
            <p>Intenta ajustar los filtros o buscar con términos diferentes</p>
          </div>
        ) : (
          <>
            <div className="books-grid">
              {currentBooks.map((book) => (
                <BookCard 
                  key={book.id || book.isbn} 
                  book={book}
                  showAvailability={true}
                  userRole={user?.role}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  « Anterior
                </button>
                
                {[...Array(Math.min(totalPages, 10))].map((_, index) => {
                  const pageNumber = index + 1;
                  const shouldShow = pageNumber === 1 || 
                                   pageNumber === totalPages || 
                                   (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2);
                  
                  if (!shouldShow) return null;
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`pagination-button ${currentPage === pageNumber ? 'active' : ''}`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  Siguiente »
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Información adicional para administradores */}
      {user && user.role === 'ADMIN' && (
        <div className="admin-info">
          <h4>Información del Administrador</h4>
          <div className="admin-stats">
            <div className="stat-item">
              <span>Total de libros:</span>
              <span>{totalBooks}</span>
            </div>
            <div className="stat-item">
              <span>Libros disponibles:</span>
              <span>{books.filter(book => book.available || book.estado === true).length}</span>
            </div>
            <div className="stat-item">
              <span>Libros en préstamo:</span>
              <span>{books.filter(book => !book.available || book.estado === false).length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookList;