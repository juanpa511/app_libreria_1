import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import bookService from '../../services/bookService';
import BookList from '../../components/books/BookList';
import BookForm from '../../components/books/BookForm';
import BookFilter from '../../components/books/BookFilter';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Layout from '../../components/common/Layout';
import { useAuth } from '../../context/AuthContext';
import '../../styles/AdminBooksPage.css';
import loanService from '../../services/loanService';
import fineService from '../../services/fineService';
import apiService from '../../services/apiService';
import { useNavigate } from 'react-router-dom';
import BookCard from '../../components/books/BookCard';

const AdminBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [booksLoading, setBooksLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    title: ''
  });
  const [pendingFilters, setPendingFilters] = useState({
    category: '',
    title: ''
  });
  const [loans, setLoans] = useState([]);
  const [fines, setFines] = useState([]);
  const [loansError, setLoansError] = useState('');
  const [finesError, setFinesError] = useState('');
  const [readerSearchEmail, setReaderSearchEmail] = useState('');
  const [searchedReader, setSearchedReader] = useState(null);
  const [readerSearchError, setReaderSearchError] = useState('');
  const [readerSearchLoading, setReaderSearchLoading] = useState(false);
  const navigate = useNavigate();

  const { loading, error, handleApiCall } = useApi();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    loadBooks();
    loadLoans();
    loadFines();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [books, filters]);

  const loadBooks = async () => {
    try {
      setBooksLoading(true);
      console.log('=== LOADING BOOKS ===');
      const response = await handleApiCall(bookService.getAllBooks);
      console.log('Books response:', response);
      
      // Usar la misma lógica que BooksPage.js
      const booksData = response?.data || [];
      console.log('Books data to set:', booksData);
      console.log('Books data length:', booksData.length);
      
      setBooks(booksData);
      console.log('Books set successfully:', booksData.length, 'books');
    } catch (err) {
      console.error('Error loading books:', err);
      setBooks([]);
    } finally {
      setBooksLoading(false);
    }
  };

  const loadLoans = async () => {
    try {
      setLoansError('');
      const response = await handleApiCall(loanService.getAllLoans);
      setLoans(response || []);
    } catch (err) {
      setLoans([]);
      setLoansError('No se pudo obtener la información de préstamos');
      console.error('Error loading loans:', err);
    }
  };

  const loadFines = async () => {
    try {
      setFinesError('');
      const response = await handleApiCall(fineService.getAllFines);
      setFines(response || []);
    } catch (err) {
      setFines([]);
      setFinesError('No se pudo obtener la información de multas');
      console.error('Error loading fines:', err);
    }
  };

  const applyFilters = () => {
    console.log('=== APPLYING FILTERS ===');
    console.log('Books:', books);
    console.log('Books type:', typeof books);
    console.log('Is books array:', Array.isArray(books));
    console.log('Filters:', filters);
    
    if (!Array.isArray(books)) {
      console.warn('Books is not an array, setting empty filtered books');
      setFilteredBooks([]);
      return;
    }
    
    let filtered = [...books];
    console.log('Initial filtered books:', filtered.length);
    
    if (filters.title) {
      filtered = filtered.filter(book =>
        book.title && book.title.toLowerCase().includes(filters.title.toLowerCase())
      );
      console.log('After title filter:', filtered.length);
    }
    if (filters.category) {
      filtered = filtered.filter(book => {
        const type = book.category || book.categoria || book.type || book.genero;
        return type && type.toLowerCase() === filters.category.toLowerCase();
      });
      console.log('After category filter:', filtered.length);
    }
    
    console.log('Final filtered books:', filtered.length);
    setFilteredBooks(filtered);
  };

  const handleCreateBook = async (bookData) => {
    try {
      console.log('=== ADMIN BOOKS PAGE DEBUG ===');
      console.log('Datos a enviar:', bookData);
      
      await handleApiCall(bookService.createBook, bookData);
      setShowForm(false);
      loadBooks();
      alert('Libro creado exitosamente');
    } catch (err) {
      console.error('=== ERROR EN ADMIN BOOKS PAGE ===');
      console.error('Error completo:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      alert(`Error al crear el libro: ${err.message}`);
    }
  };

  const handleEditBook = (book) => {
    alert('La funcionalidad de editar libros no está disponible en este momento.');
  };

  const handleDeleteBook = async (bookId) => {
    alert('La funcionalidad de eliminar libros no está disponible en este momento.');
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (term) => {
    setFilters(prev => ({ ...prev, title: term }));
  };

  const resetFilters = () => {
    setFilters({ category: '', title: '' });
    setPendingFilters({ category: '', title: '' });
  };

  const applyPendingFilters = () => {
    setFilters({ ...pendingFilters });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      applyPendingFilters();
    }
  };

  const handleReaderSearch = async () => {
    if (!readerSearchEmail.trim()) {
      setReaderSearchError('Por favor ingresa un email válido');
      return;
    }

    try {
      setReaderSearchLoading(true);
      setReaderSearchError('');
      setSearchedReader(null);
      
      console.log('Buscando lector con email:', readerSearchEmail.trim());
      const response = await handleApiCall(() => apiService.findReaderByEmail(readerSearchEmail.trim()));
      console.log('Respuesta del servidor:', response);
      setSearchedReader(response);
    } catch (err) {
      console.error('Error completo:', err);
      console.error('Error message:', err.message);
      
      if (err.message.includes('404') || err.message.includes('not found')) {
        setReaderSearchError('No se encontró un lector con ese email');
      } else if (err.message.includes('403') || err.message.includes('permisos')) {
        setReaderSearchError('No tienes permisos para buscar lectores');
      } else {
        setReaderSearchError(`Error al buscar lector: ${err.message}`);
      }
      setSearchedReader(null);
    } finally {
      setReaderSearchLoading(false);
    }
  };

  const clearReaderSearch = () => {
    setReaderSearchEmail('');
    setSearchedReader(null);
    setReaderSearchError('');
  };

  const availableBooks = Array.isArray(books) ? books.filter(book => book.availableCopies > 0).length : 0;
  const unavailableBooks = Array.isArray(books) ? books.filter(book => book.availableCopies === 0).length : 0;
  const totalBooks = Array.isArray(books) ? books.length : 0;

  if (booksLoading) {
    return (
      <Layout>
        <div className="admin-books-page">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (showForm) {
    return (
      <Layout>
      <div className="admin-books-page">
        <div className="page-header">
          <button 
            onClick={handleCloseForm}
            className="btn btn-secondary"
          >
            ← Volver a la Lista
          </button>
        </div>
        
        <div className="user-info" style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
          <h4>Información del Usuario (AdminBooksPage):</h4>
          <p><strong>Email:</strong> {user?.email || 'No disponible'}</p>
          <p><strong>Rol ID:</strong> {user?.roleId || 'No disponible'}</p>
          <p><strong>Es Admin:</strong> {isAdmin ? 'Sí' : 'No'}</p>
          <p><strong>Token:</strong> {localStorage.getItem('token') ? 'Presente' : 'Ausente'}</p>
        </div>
        
        <BookForm
          onSubmit={handleCreateBook}
          loading={loading}
        />
      </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="admin-books-page">
        <div className="admin-resumenes" style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
          <div className="resumen-card" style={{ background: '#f0f8ff', padding: '1rem', borderRadius: '8px', flex: 1 }}>
            <h3>Préstamos Activos</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }} title={loansError ? loansError : ''}>
              {loansError ? <span style={{ color: '#888' }}>0</span> : (Array.isArray(loans) ? loans.filter(l => l.state === 0).length : 0)}
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/admin/loans')}>Ver Préstamos</button>
            {loansError && <div style={{ color: '#888', fontSize: '0.9rem' }}>No disponible</div>}
          </div>
          <div className="resumen-card" style={{ background: '#fff8f0', padding: '1rem', borderRadius: '8px', flex: 1 }}>
            <h3>Multas Activas</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }} title={finesError ? finesError : ''}>
              {finesError ? <span style={{ color: '#888' }}>0</span> : (Array.isArray(fines) ? fines.length : 0)}
            </p>
            <button className="btn btn-warning" onClick={() => navigate('/admin/fines')}>Ver Multas</button>
            {finesError && <div style={{ color: '#888', fontSize: '0.9rem' }}>No disponible</div>}
          </div>
          <div className="resumen-card" style={{ background: '#f0fff0', padding: '1rem', borderRadius: '8px', flex: 1 }}>
            <h3>Devoluciones</h3>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>Devueltos: {Array.isArray(loans) ? loans.filter(l => l.state === 1).length : 0}</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>Pendientes: {Array.isArray(loans) ? loans.filter(l => l.state === 0).length : 0}</p>
            <button className="btn btn-success" onClick={() => navigate('/admin/return')}>Ver Devoluciones</button>
          </div>
        </div>

        <div className="page-header">
          <h1>Administrar Libros</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="stat-number" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b3b3b' }}>{Array.isArray(books) ? books.length : 0}</span>
            <button 
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              + Nuevo Libro
            </button>
          </div>
        </div>

        <div className="filters-section" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <select
              value={pendingFilters.category}
              onChange={e => setPendingFilters({ ...pendingFilters, category: e.target.value })}
              className="filter-select"
            >
              <option value="">Todos los tipos</option>
              <option value="educacion">Educación</option>
              <option value="novela">Novela</option>
              <option value="aventura">Aventura</option>
              <option value="poemas">Poemas</option>
              <option value="ciencia">Ciencia</option>
              <option value="historia">Historia</option>
              <option value="arte">Arte</option>
              <option value="tecnologia">Tecnología</option>
            </select>
            <input
              type="text"
              placeholder="Buscar por título..."
              value={pendingFilters.title}
              onChange={e => setPendingFilters({ ...pendingFilters, title: e.target.value })}
              onKeyDown={handleKeyDown}
              className="search-input"
            />
            <button onClick={applyPendingFilters} className="btn btn-primary">Buscar</button>
            <button onClick={resetFilters} className="btn btn-secondary">Limpiar Filtros</button>
          </div>
          <span className="results-count" style={{ marginLeft: '1rem' }}>
            Mostrando {Array.isArray(filteredBooks) ? filteredBooks.length : 0} de {Array.isArray(books) ? books.length : 0} libros
          </span>
        </div>

        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
          </div>
        )}

        {/* Lista de libros filtrados en grilla */}
        <div className="books-grid">
          {!Array.isArray(filteredBooks) || filteredBooks.length === 0 ? (
            <div className="no-books">
              <div className="no-books-icon">📚</div>
              <h3>No se encontraron libros</h3>
              {Array.isArray(books) && books.length === 0 ? (
                <p>No hay libros registrados en el sistema</p>
              ) : (
                <>
                  <p>No hay libros que coincidan con los criterios de búsqueda seleccionados</p>
                  <p>Intenta ajustar los filtros o buscar con términos diferentes</p>
                </>
              )}
            </div>
          ) : (
            filteredBooks.map((book) => (
              <BookCard
                key={book.id || book.isbn}
                book={book}
                showAvailability={true}
                userRole={user?.role}
                onEditBook={handleEditBook}
                onDeleteBook={handleDeleteBook}
                showAdminActions={true}
              />
            ))
          )}
        </div>

        {/* Sección de búsqueda de lectores */}
        <div className="reader-search-section" style={{ marginTop: '3rem', padding: '2rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div className="section-header" style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h2 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>🔍 Buscar Lector</h2>
            <p style={{ color: '#718096', margin: 0 }}>Busca lectores por su dirección de email</p>
            <p style={{ color: '#a0aec0', margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
              💡 Tip: Asegúrate de que el email esté registrado en el sistema
            </p>
          </div>

          <div className="search-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="search-input-group" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <input
                type="email"
                placeholder="Ingresa el email del lector..."
                value={readerSearchEmail}
                onChange={(e) => setReaderSearchEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleReaderSearch()}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s ease'
                }}
              />
              <button
                onClick={handleReaderSearch}
                disabled={readerSearchLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: readerSearchLoading ? '#a0aec0' : '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: readerSearchLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {readerSearchLoading && <span>⏳</span>}
                {readerSearchLoading ? 'Buscando...' : 'Buscar'}
              </button>
              {searchedReader && (
                <button
                  onClick={clearReaderSearch}
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#718096',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  Limpiar
                </button>
              )}
            </div>

            {readerSearchError && (
              <div style={{
                padding: '1rem',
                backgroundColor: '#fed7d7',
                color: '#742a2a',
                borderRadius: '8px',
                marginBottom: '1rem',
                border: '1px solid #feb2b2'
              }}>
                {readerSearchError}
              </div>
            )}

            {searchedReader && (
              <div className="reader-result" style={{
                padding: '1.5rem',
                backgroundColor: '#f0fff4',
                borderRadius: '12px',
                border: '2px solid #9ae6b4'
              }}>
                <div style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#c6f6d5',
                  color: '#22543d',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  ✅ Lector encontrado exitosamente
                </div>
                <div className="reader-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, color: '#2d3748' }}>
                    {searchedReader.name} {searchedReader.lastName}
                  </h3>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    backgroundColor: searchedReader.state ? '#c6f6d5' : '#fed7d7',
                    color: searchedReader.state ? '#22543d' : '#742a2a'
                  }}>
                    {searchedReader.state ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <div className="reader-details" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div className="detail-item">
                    <strong style={{ color: '#4a5568' }}>Email:</strong>
                    <span style={{ color: '#718096', marginLeft: '0.5rem' }}>{searchedReader.email}</span>
                  </div>
                  <div className="detail-item">
                    <strong style={{ color: '#4a5568' }}>Nombre:</strong>
                    <span style={{ color: '#718096', marginLeft: '0.5rem' }}>{searchedReader.name || 'No especificado'}</span>
                  </div>
                  <div className="detail-item">
                    <strong style={{ color: '#4a5568' }}>Apellido:</strong>
                    <span style={{ color: '#718096', marginLeft: '0.5rem' }}>{searchedReader.lastName || 'No especificado'}</span>
                  </div>
                  <div className="detail-item">
                    <strong style={{ color: '#4a5568' }}>Estado:</strong>
                    <span style={{ 
                      color: searchedReader.state ? '#22543d' : '#742a2a', 
                      marginLeft: '0.5rem',
                      fontWeight: '600'
                    }}>
                      {searchedReader.state ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>

                <div className="reader-actions" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => alert('Funcionalidad de editar lector no disponible aún')}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    Editar Lector
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('¿Estás seguro de que quieres eliminar este lector?')) {
                        alert('Funcionalidad de eliminar lector no disponible aún');
                      }
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#e53e3e',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    Eliminar Lector
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminBooksPage;