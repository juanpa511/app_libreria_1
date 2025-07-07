import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import bookService from '../../services/bookService';
import BookList from '../../components/books/BookList';
import BookForm from '../../components/books/BookForm';
import BookFilter from '../../components/books/BookFilter';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../../styles/AdminBooksPage.css'; 

const AdminBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    author: '',
    availability: '',
    year: ''
  });

  const { loading, error, execute } = useApi();

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [books, searchTerm, filters]);

  const loadBooks = async () => {
    try {
      const response = await execute(() => bookService.getAllBooks());
      setBooks(response || []);
    } catch (err) {
      console.error('Error loading books:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...books];

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtros específicos
    if (filters.category) {
      filtered = filtered.filter(book => book.category === filters.category);
    }

    if (filters.author) {
      filtered = filtered.filter(book =>
        book.author.toLowerCase().includes(filters.author.toLowerCase())
      );
    }

    if (filters.availability) {
      filtered = filtered.filter(book => {
        if (filters.availability === 'available') {
          return book.availableCopies > 0;
        } else if (filters.availability === 'unavailable') {
          return book.availableCopies === 0;
        }
        return true;
      });
    }

    if (filters.year) {
      filtered = filtered.filter(book => book.publicationYear === parseInt(filters.year));
    }

    setFilteredBooks(filtered);
  };

  const handleCreateBook = async (bookData) => {
    try {
      await execute(() => bookService.createBook(bookData));
      setShowForm(false);
      loadBooks();
      alert('Libro creado exitosamente');
    } catch (err) {
      console.error('Error creating book:', err);
      alert('Error al crear el libro');
    }
  };

  const handleUpdateBook = async (bookData) => {
    try {
      await execute(() => bookService.updateBook(selectedBook.id, bookData));
      setShowForm(false);
      setSelectedBook(null);
      loadBooks();
      alert('Libro actualizado exitosamente');
    } catch (err) {
      console.error('Error updating book:', err);
      alert('Error al actualizar el libro');
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este libro?')) {
      try {
        await execute(() => bookService.deleteBook(bookId));
        loadBooks();
        alert('Libro eliminado exitosamente');
      } catch (err) {
        console.error('Error deleting book:', err);
        alert('Error al eliminar el libro');
      }
    }
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedBook(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      author: '',
      availability: '',
      year: ''
    });
    setSearchTerm('');
  };

  const availableBooks = books.filter(book => book.availableCopies > 0).length;
  const unavailableBooks = books.filter(book => book.availableCopies === 0).length;
  const totalBooks = books.length;

  if (showForm) {
    return (
      <div className="admin-books-page">
        <div className="page-header">
          <button 
            onClick={handleCloseForm}
            className="btn btn-secondary"
          >
            ← Volver a la Lista
          </button>
        </div>
        
        <BookForm
          onSubmit={selectedBook ? handleUpdateBook : handleCreateBook}
          initialData={selectedBook}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <div className="admin-books-page">
      <div className="page-header">
        <h1>Administrar Libros</h1>
        <div className="header-actions">
          <div className="stats-summary">
            <div className="stat-item">
              <span className="stat-number">{totalBooks}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item success">
              <span className="stat-number">{availableBooks}</span>
              <span className="stat-label">Disponibles</span>
            </div>
            <div className="stat-item warning">
              <span className="stat-number">{unavailableBooks}</span>
              <span className="stat-label">Agotados</span>
            </div>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            + Nuevo Libro
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar libros por título, autor o ISBN..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="search-input"
          />
        </div>

        <BookFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          books={books}
        />

        <div className="filter-actions">
          <button 
            onClick={resetFilters}
            className="btn btn-secondary"
          >
            Limpiar Filtros
          </button>
          <span className="results-count">
            Mostrando {filteredBooks.length} de {totalBooks} libros
          </span>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <BookList
          books={filteredBooks}
          onEditBook={handleEditBook}
          onDeleteBook={handleDeleteBook}
          showAdminActions={true}
        />
      )}
    </div>
  );
};

export default AdminBooksPage;