import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import loanService from '../../services/loanService';
import LoanList from '../../components/Loans/LoanList';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../../styles/AdminLoansPage.css';

const AdminLoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    readerId: '',
    bookId: '',
    startDate: '',
    endDate: '',
    overdue: false
  });

  const { loading, error, execute } = useApi();

  useEffect(() => {
    loadLoans();
  }, [filters]);

  const loadLoans = async () => {
    try {
      const response = await execute(() => loanService.getAllLoans(filters));
      setLoans(response || []);
    } catch (err) {
      console.error('Error loading loans:', err);
    }
  };

  const handleReturnLoan = async (loanId) => {
    try {
      await execute(() => loanService.returnLoan(loanId));
      loadLoans();
      alert('Préstamo devuelto exitosamente');
    } catch (err) {
      console.error('Error returning loan:', err);
      alert('Error al devolver el préstamo');
    }
  };

  const handleRenewLoan = async (loanId) => {
    try {
      await execute(() => loanService.renewLoan(loanId));
      loadLoans();
      alert('Préstamo renovado exitosamente');
    } catch (err) {
      console.error('Error renewing loan:', err);
      alert('Error al renovar el préstamo');
    }
  };

  const handleCancelLoan = async (loanId) => {
    if (window.confirm('¿Está seguro de que desea cancelar este préstamo?')) {
      try {
        await execute(() => loanService.cancelLoan(loanId));
        loadLoans();
        alert('Préstamo cancelado exitosamente');
      } catch (err) {
        console.error('Error cancelling loan:', err);
        alert('Error al cancelar el préstamo');
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      readerId: '',
      bookId: '',
      startDate: '',
      endDate: '',
      overdue: false
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'ACTIVE': { label: 'Activo', className: 'status-active' },
      'RETURNED': { label: 'Devuelto', className: 'status-returned' },
      'OVERDUE': { label: 'Vencido', className: 'status-overdue' },
      'CANCELLED': { label: 'Cancelado', className: 'status-cancelled' }
    };

    const statusInfo = statusMap[status] || { label: status, className: 'status-default' };
    
    return (
      <span className={`status-badge ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  const overdueCount = loans.filter(loan => loan.status === 'OVERDUE').length;
  const activeCount = loans.filter(loan => loan.status === 'ACTIVE').length;
  const totalCount = loans.length;

  return (
    <div className="admin-loans-page">
      <div className="page-header">
        <h1>Administrar Préstamos</h1>
        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-number">{totalCount}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{activeCount}</span>
            <span className="stat-label">Activos</span>
          </div>
          <div className="stat-item alert">
            <span className="stat-number">{overdueCount}</span>
            <span className="stat-label">Vencidos</span>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Estado:</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">Todos</option>
              <option value="ACTIVE">Activos</option>
              <option value="RETURNED">Devueltos</option>
              <option value="OVERDUE">Vencidos</option>
              <option value="CANCELLED">Cancelados</option>
            </select>
          </div>

          <div className="filter-group">
            <label>ID Lector:</label>
            <input
              type="text"
              name="readerId"
              value={filters.readerId}
              onChange={handleFilterChange}
              placeholder="Buscar por ID lector"
            />
          </div>

          <div className="filter-group">
            <label>ID Libro:</label>
            <input
              type="text"
              name="bookId"
              value={filters.bookId}
              onChange={handleFilterChange}
              placeholder="Buscar por ID libro"
            />
          </div>

          <div className="filter-group">
            <label>Fecha Desde:</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label>Fecha Hasta:</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="overdue"
                checked={filters.overdue}
                onChange={handleFilterChange}
              />
              Solo préstamos vencidos
            </label>
          </div>
        </div>

        <div className="filter-actions">
          <button 
            onClick={resetFilters}
            className="btn btn-secondary"
          >
            Limpiar Filtros
          </button>
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
        <LoanList
          loans={loans}
          onReturnLoan={handleReturnLoan}
          onRenewLoan={handleRenewLoan}
          onCancelLoan={handleCancelLoan}
          showAdminActions={true}
        />
      )}
    </div>
  );
};

export default AdminLoansPage;