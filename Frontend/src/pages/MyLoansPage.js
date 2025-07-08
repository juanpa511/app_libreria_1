import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Layout from '../components/common/Layout';
import loanService from '../services/loanService';
import FineCard from '../components/fines/FineCard';
import fineService from '../services/fineService';
import '../styles/MyLoansPage.css'; 

const MyLoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, returned, overdue
  
  const { user } = useAuth();

  useEffect(() => {
    loadMyLoans();
  }, []);

  const loadMyLoans = async () => {
    try {
      setLoading(true);
      console.log("Usuario actual:", user);
      const response = await loanService.getLoansByUser(user.id);
      setLoans(response.data);
    } catch (err) {
      setError('Error al cargar tus préstamos');
      console.error('Error loading loans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (loanId) => {
    try {
      await loanService.returnBook(loanId);
      alert('Libro devuelto exitosamente');
      loadMyLoans(); // Recargar la lista
    } catch (err) {
      alert('Error al devolver el libro: ' + (err.message || 'Error desconocido'));
    }
  };

  const handleRenewLoan = async (loanId) => {
    try {
      await loanService.renewLoan(loanId);
      alert('Préstamo renovado exitosamente');
      loadMyLoans(); // Recargar la lista
    } catch (err) {
      alert('Error al renovar el préstamo: ' + (err.message || 'Error desconocido'));
    }
  };

  const getFilteredLoans = () => {
    const currentDate = new Date();
    
    switch (filter) {
      case 'active':
        return loans.filter(loan => loan.status === 'ACTIVE');
      case 'returned':
        return loans.filter(loan => loan.status === 'RETURNED');
      case 'overdue':
        return loans.filter(loan => {
          const dueDate = new Date(loan.dueDate);
          return loan.status === 'ACTIVE' && dueDate < currentDate;
        });
      default:
        return loans;
    }
  };

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (loan) => {
    if (loan.status === 'RETURNED') return 'status-returned';
    
    const daysRemaining = getDaysRemaining(loan.dueDate);
    if (daysRemaining < 0) return 'status-overdue';
    if (daysRemaining <= 3) return 'status-warning';
    return 'status-active';
  };

  const getStatusText = (loan) => {
    if (loan.status === 'RETURNED') return 'Devuelto';
    
    const daysRemaining = getDaysRemaining(loan.dueDate);
    if (daysRemaining < 0) return `Vencido (${Math.abs(daysRemaining)} días)`;
    if (daysRemaining === 0) return 'Vence hoy';
    if (daysRemaining === 1) return 'Vence mañana';
    return `${daysRemaining} días restantes`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const filteredLoans = getFilteredLoans();

  if (loading) {
    return (
      <Layout>
        <div className="my-loans-page">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="my-loans-page">
          <div className="error-message">
            <h2>Error</h2>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={loadMyLoans}>
              Reintentar
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="my-loans-page">
        <div className="page-header">
          <h1>Mis Préstamos</h1>
          <p>Gestiona tus libros prestados y historial de préstamos</p>
        </div>

        <div className="loans-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todos ({loans.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Activos ({loans.filter(l => l.status === 'ACTIVE').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'returned' ? 'active' : ''}`}
            onClick={() => setFilter('returned')}
          >
            Devueltos ({loans.filter(l => l.status === 'RETURNED').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'overdue' ? 'active' : ''}`}
            onClick={() => setFilter('overdue')}
          >
            Vencidos ({loans.filter(l => {
              const dueDate = new Date(l.dueDate);
              return l.status === 'ACTIVE' && dueDate < new Date();
            }).length})
          </button>
        </div>

        {filteredLoans.length === 0 ? (
          <div className="no-loans">
            <span className="no-loans-icon">📚</span>
            <h3>No tienes préstamos</h3>
            <p>
              {filter === 'all' 
                ? 'Aún no has solicitado ningún préstamo'
                : `No tienes préstamos ${filter === 'active' ? 'activos' : filter === 'returned' ? 'devueltos' : 'vencidos'}`
              }
            </p>
          </div>
        ) : (
          <div className="loans-grid">
            {filteredLoans.map(loan => (
              <div key={loan.id} className="loan-card">
                <div className="loan-header">
                  <div className="book-info">
                    <h3 className="book-title">{loan.book?.title || 'Título no disponible'}</h3>
                    <p className="book-author">{loan.book?.author || 'Autor no disponible'}</p>
                    <p className="book-isbn">ISBN: {loan.book?.isbn || 'N/A'}</p>
                  </div>
                  <div className={`loan-status ${getStatusColor(loan)}`}>
                    {getStatusText(loan)}
                  </div>
                </div>

                <div className="loan-details">
                  <div className="loan-dates">
                    <div className="date-item">
                      <span className="date-label">Fecha de préstamo:</span>
                      <span className="date-value">{formatDate(loan.loanDate)}</span>
                    </div>
                    <div className="date-item">
                      <span className="date-label">Fecha de vencimiento:</span>
                      <span className="date-value">{formatDate(loan.dueDate)}</span>
                    </div>
                    {loan.returnDate && (
                      <div className="date-item">
                        <span className="date-label">Fecha de devolución:</span>
                        <span className="date-value">{formatDate(loan.returnDate)}</span>
                      </div>
                    )}
                  </div>

                  {loan.status === 'ACTIVE' && (
                    <div className="loan-actions">
                      <button 
                        className="btn btn-primary btn-small"
                        onClick={() => handleReturnBook(loan.id)}
                      >
                        Devolver Libro
                      </button>
                      <button 
                        className="btn btn-secondary btn-small"
                        onClick={() => handleRenewLoan(loan.id)}
                      >
                        Renovar Préstamo
                      </button>
                    </div>
                  )}

                  {loan.fine && (
                    <div className="loan-fine">
                      <span className="fine-icon">⚠️</span>
                      <span className="fine-text">
                        Multa: ${loan.fine.amount} - {loan.fine.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyLoansPage;