import React, { useState, useEffect } from 'react';
import loanService from '../services/loanService';
import readerService from '../services/readerService';
import bookService from '../services/bookService';
import LoanCard from '../components/Loans/LoanCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Layout from '../components/common/Layout';
import '../styles/LoanPage.css';

const LoanPage = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [readers, setReaders] = useState([]);
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [newLoan, setNewLoan] = useState({
    readerId: '',
    bookId: '',
    loanDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchLoans();
    fetchReaders();
    fetchBooks();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const data = await loanService.getAllLoans();
      setLoans(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReaders = async () => {
    try {
      const data = await readerService.getAllReaders();
      setReaders(data);
    } catch (err) {
      console.error('Error fetching readers:', err);
    }
  };

  const fetchBooks = async () => {
    try {
      const data = await bookService.getAllBooks();
      setBooks(data.filter(book => book.stock > 0)); // Solo libros disponibles
    } catch (err) {
      console.error('Error fetching books:', err);
    }
  };

  const handleCreateLoan = async (e) => {
    e.preventDefault();
    try {
      // Validar fecha de vencimiento
      const loanDate = new Date(newLoan.loanDate);
      const dueDate = new Date(newLoan.dueDate);
      
      if (dueDate <= loanDate) {
        throw new Error('La fecha de vencimiento debe ser posterior a la fecha del préstamo');
      }

      await loanService.createLoan(newLoan);
      await fetchLoans();
      setShowCreateForm(false);
      setNewLoan({
        readerId: '',
        bookId: '',
        loanDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        notes: ''
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReturnBook = async (loanId) => {
    try {
      await loanService.returnBook(loanId);
      await fetchLoans();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRenewLoan = async (loanId) => {
    try {
      await loanService.renewLoan(loanId);
      await fetchLoans();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.readerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.bookTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.readerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && !loan.returnDate) ||
                         (filterStatus === 'returned' && loan.returnDate) ||
                         (filterStatus === 'overdue' && !loan.returnDate && new Date(loan.dueDate) < new Date());
    
    return matchesSearch && matchesFilter;
  });

  const getDefaultDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 14); // 14 días por defecto
    return date.toISOString().split('T')[0];
  };

  if (loading) return (
    <Layout>
      <LoadingSpinner />
    </Layout>
  );

  return (
    <Layout>
      <div className="loan-page">
        <div className="container">
          <div className="page-header">
            <h1>Gestión de Préstamos</h1>
            <button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="create-btn"
            >
              {showCreateForm ? 'Cancelar' : '+ Nuevo Préstamo'}
            </button>
          </div>

          {error && (
            <div className="error-message">
              <p>Error: {error}</p>
              <button onClick={fetchLoans} className="retry-btn">
                Reintentar
              </button>
            </div>
          )}

          {showCreateForm && (
            <div className="create-loan-form">
              <h3>Crear Nuevo Préstamo</h3>
              <form onSubmit={handleCreateLoan}>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="readerId">Lector *</label>
                    <select
                      id="readerId"
                      value={newLoan.readerId}
                      onChange={(e) => setNewLoan({...newLoan, readerId: e.target.value})}
                      required
                    >
                      <option value="">Seleccione un lector</option>
                      {readers.map(reader => (
                        <option key={reader.id} value={reader.id}>
                          {reader.name} - {reader.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="bookId">Libro *</label>
                    <select
                      id="bookId"
                      value={newLoan.bookId}
                      onChange={(e) => setNewLoan({...newLoan, bookId: e.target.value})}
                      required
                    >
                      <option value="">Seleccione un libro</option>
                      {books.map(book => (
                        <option key={book.id} value={book.id}>
                          {book.title} - {book.author} (Stock: {book.stock})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="loanDate">Fecha del Préstamo *</label>
                    <input
                      type="date"
                      id="loanDate"
                      value={newLoan.loanDate}
                      onChange={(e) => setNewLoan({...newLoan, loanDate: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="dueDate">Fecha de Vencimiento *</label>
                    <input
                      type="date"
                      id="dueDate"
                      value={newLoan.dueDate || getDefaultDueDate()}
                      onChange={(e) => setNewLoan({...newLoan, dueDate: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="notes">Notas</label>
                    <textarea
                      id="notes"
                      value={newLoan.notes}
                      onChange={(e) => setNewLoan({...newLoan, notes: e.target.value})}
                      rows="3"
                      placeholder="Notas adicionales..."
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    Crear Préstamo
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="loans-controls">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Buscar por lector, libro o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filters">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Todos los préstamos</option>
                <option value="active">Préstamos activos</option>
                <option value="returned">Préstamos devueltos</option>
                <option value="overdue">Préstamos vencidos</option>
              </select>
            </div>
          </div>

          <div className="loans-stats">
            <div className="stat-card">
              <span className="stat-number">{loans.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{loans.filter(l => !l.returnDate).length}</span>
              <span className="stat-label">Activos</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{loans.filter(l => l.returnDate).length}</span>
              <span className="stat-label">Devueltos</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {loans.filter(l => !l.returnDate && new Date(l.dueDate) < new Date()).length}
              </span>
              <span className="stat-label">Vencidos</span>
            </div>
          </div>

          <div className="loans-list">
            {filteredLoans.length === 0 ? (
              <div className="no-loans">
                <div className="no-loans-icon">📋</div>
                <h3>No hay préstamos que mostrar</h3>
                <p>No se encontraron préstamos con los filtros seleccionados</p>
              </div>
            ) : (
              filteredLoans.map(loan => (
                <LoanCard
                  key={loan.id}
                  loan={loan}
                  onReturn={handleReturnBook}
                  onRenew={handleRenewLoan}
                  showActions={true}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoanPage;