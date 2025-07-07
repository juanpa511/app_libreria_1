import React, { useState, useEffect } from 'react';
import LoanCard from './LoanCard';

const LoanList = ({ 
  loans = [], 
  onReturnLoan, 
  onExtendLoan, 
  onViewDetails,
  isAdmin = false,
  loading = false 
}) => {
  const [filteredLoans, setFilteredLoans] = useState(loans);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    let filtered = [...loans];

    // Filtrar por estado
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(loan => loan.status === filterStatus);
    }

    // Ordenar
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Convertir fechas para comparación
      if (sortBy === 'dueDate' || sortBy === 'loanDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredLoans(filtered);
  }, [loans, filterStatus, sortBy, sortOrder]);

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getStatusCount = (status) => {
    return loans.filter(loan => loan.status === status).length;
  };

  if (loading) {
    return (
      <div className="loan-list-loading">
        <div className="loading-spinner">Cargando préstamos...</div>
      </div>
    );
  }

  return (
    <div className="loan-list-container">
      <div className="loan-list-header">
        <h2>
          {isAdmin ? 'Gestión de Préstamos' : 'Mis Préstamos'}
          <span className="total-count">({loans.length})</span>
        </h2>
        
        <div className="loan-list-controls">
          {/* Filtros por estado */}
          <div className="filter-section">
            <h4>Filtrar por Estado:</h4>
            <div className="filter-buttons">
              <button 
                className={filterStatus === 'ALL' ? 'active' : ''}
                onClick={() => handleStatusFilter('ALL')}
              >
                Todos ({loans.length})
              </button>
              <button 
                className={filterStatus === 'ACTIVE' ? 'active' : ''}
                onClick={() => handleStatusFilter('ACTIVE')}
              >
                Activos ({getStatusCount('ACTIVE')})
              </button>
              <button 
                className={filterStatus === 'RETURNED' ? 'active' : ''}
                onClick={() => handleStatusFilter('RETURNED')}
              >
                Devueltos ({getStatusCount('RETURNED')})
              </button>
              <button 
                className={filterStatus === 'OVERDUE' ? 'active' : ''}
                onClick={() => handleStatusFilter('OVERDUE')}
              >
                Vencidos ({getStatusCount('OVERDUE')})
              </button>
            </div>
          </div>

          {/* Controles de ordenamiento */}
          <div className="sort-section">
            <h4>Ordenar por:</h4>
            <div className="sort-buttons">
              <button 
                className={sortBy === 'dueDate' ? 'active' : ''}
                onClick={() => handleSort('dueDate')}
              >
                Fecha Vencimiento {sortBy === 'dueDate' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button 
                className={sortBy === 'loanDate' ? 'active' : ''}
                onClick={() => handleSort('loanDate')}
              >
                Fecha Préstamo {sortBy === 'loanDate' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button 
                className={sortBy === 'bookTitle' ? 'active' : ''}
                onClick={() => handleSort('bookTitle')}
              >
                Título {sortBy === 'bookTitle' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="loan-list-content">
        {filteredLoans.length === 0 ? (
          <div className="no-loans">
            <p>
              {filterStatus === 'ALL' 
                ? 'No hay préstamos disponibles' 
                : `No hay préstamos con estado: ${filterStatus}`
              }
            </p>
          </div>
        ) : (
          <div className="loans-grid">
            {filteredLoans.map(loan => (
              <LoanCard
                key={loan.id}
                loan={loan}
                onReturnLoan={onReturnLoan}
                onExtendLoan={onExtendLoan}
                onViewDetails={onViewDetails}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </div>

      <div className="loan-list-footer">
        <div className="stats">
          <span>
            Mostrando {filteredLoans.length} de {loans.length} préstamos
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoanList;