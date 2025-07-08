import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BookCard from '../components/books/BookCard';
import BookFilter from '../components/books/BookFilter';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Layout from '../components/common/Layout';
import bookService from '../services/bookService';
import loanService from '../services/loanService';
import fineService from '../services/fineService';
import '../styles/BooksPage.css';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(12);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await bookService.getAllBooks();
      console.log('Libros recibidos:', response.data);
      const booksData = response?.data || [];
      setBooks(booksData);
      setFilteredBooks(booksData);
    } catch (err) {
      setError('Error al cargar los libros');
      console.error('Error loading books:', err);
      // Asegurar que siempre tengamos arrays válidos
      setBooks([]);
      setFilteredBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    let filtered = books || [];

    // Filtrar por tipo
    if (filters.type) {
      filtered = filtered.filter(book => 
        book.type?.toLowerCase() === filters.type.toLowerCase()
      );
    }

    // Filtrar por disponibilidad
    if (filters.availability) {
      if (filters.availability.toLowerCase() === 'available') {
        filtered = filtered.filter(book => 
          book.available === true || book.status?.toLowerCase() === 'disponible'
        );
      } else if (filters.availability.toLowerCase() === 'borrowed') {
        filtered = filtered.filter(book => 
          book.available === false || book.status?.toLowerCase() === 'prestado'
        );
      }
    }

    // Filtrar por género
    if (filters.genre) {
      filtered = filtered.filter(book => 
        book.genre?.toLowerCase() === filters.genre.toLowerCase()
      );
    }

    // Filtrar por año
    if (filters.year) {
      filtered = filtered.filter(book => 
        book.publicationYear?.toString() === filters.year
      );
    }

    // Filtrar por término de búsqueda
    if (filters.searchTerm && filters.searchTerm.trim()) {
      filtered = filtered.filter(book =>
        (book.title?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        book.isbn?.toLowerCase().includes(filters.searchTerm.toLowerCase()))
      );
    }

    setFilteredBooks(filtered);
    setCurrentPage(1);
  };

  const handleBorrow = async (book) => {
    try {
      await loanService.createLoan({
        bookId: book.id,
        userId: user.id,
        loanDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 días
      });
      
      alert('Préstamo solicitado exitosamente');
      loadBooks(); // Recargar para actualizar el estado
    } catch (err) {
      alert('Error al solicitar préstamo: ' + (err.message || 'Error desconocido'));
    }
  };

  const handleCreateLoan = () => {
    navigate('/loan');
  };

  const handleViewFines = () => {
    navigate('/my-fines');
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
        {console.log('Usuario autenticado:', user)}
        <div className="books-content">
          <div className="books-sidebar">
            <BookFilter 
              onFilterChange={handleFilterChange}
            />
          </div>

          {user?.roleId === 2 && (
            <div className="books-header-actions" style={{ justifyContent: 'center', margin: '1.5rem 0', display: 'flex', gap: '1rem' }}>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/my-loans')}
                title="Ver mis préstamos"
              >
                📚 Ver mis Préstamos
              </button>
              <button 
                className="btn btn-secondary"
                onClick={handleViewFines}
                title="Ver mis deudas"
              >
                💰 Ver Mis Multas
              </button>
            </div>
          )}

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
                  {/* Card para crear préstamo manual - eliminada para READER */}
                  {currentBooks.map(book => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onBorrow={handleBorrow}
                      userRole={user?.role}
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

export default BooksPage;