import React, { useState, useEffect, useCallback } from 'react';
import { useApi } from '../../hooks/useApi';
import loanService from '../../services/loanService';
import LoanList from '../../components/Loans/LoanList';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../../styles/AdminLoansPage.css';

const AdminLoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    readerId: '',
    bookId: '',
    startDate: '',
    endDate: '',
    overdue: false
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [confirmAction, setConfirmAction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const { loading, error, execute } = useApi();

  // Cargar préstamos
  const loadLoans = useCallback(async () => {
    try {
      const response = await execute(() => loanService.getAllLoans());
      if (response) {
        setLoans(response);
        applyFilters(response);
      }
    } catch (err) {
      console.error('Error loading loans:', err);
      showNotification('Error al cargar préstamos', 'error');
    }
  }, [execute]);

  // Aplicar filtros
  const applyFilters = useCallback((loansData) => {
    let filtered = [...loansData];

    if (filters.status) {
      filtered = filtered.filter(loan => loan.status === filters.status);
    }

    if (filters.readerId) {
      filtered = filtered.filter(loan => 
        loan.readerId?.toString().includes(filters.readerId) ||
        loan.reader?.name?.toLowerCase().includes(filters.readerId.toLowerCase())
      );
    }

    if (filters.bookId) {
      filtered = filtered.filter(loan => 
        loan.bookId?.toString().includes(filters.bookId) ||
        loan.book?.title?.toLowerCase().includes(filters.bookId.toLowerCase())
      );
    }

    if (filters.startDate) {
      filtered = filtered.filter(loan => 
        new Date(loan.createdAt) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(loan => 
        new Date(loan.createdAt) <= new Date(filters.endDate)
      );
    }

    if (filters.overdue) {
      filtered = filtered.filter(loan => loan.status === 'OVERDUE');
    }

    setFilteredLoans(filtered);
    setCurrentPage(1);
  }, [filters]);

  // Efectos
  useEffect(() => {
    loadLoans();
  }, [loadLoans]);

  useEffect(() => {
    applyFilters(loans);
  }, [filters, loans, applyFilters]);

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  // Handlers
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  const handleActionWithConfirm = (action, loanId, message) => {
    setConfirmAction({ action, loanId, message });
  };

  const executeAction = async () => {
    if (!confirmAction) return;

    try {
      await execute(() => confirmAction.action(confirmAction.loanId));
      loadLoans();
      setConfirmAction(null);
      
      const actionMessages = {
        [loanService.returnLoan]: 'Préstamo devuelto exitosamente',
        [loanService.renewLoan]: 'Préstamo renovado exitosamente',
        [loanService.cancelLoan]: 'Préstamo cancelado exitosamente'
      };
      
      showNotification(actionMessages[confirmAction.action] || 'Operación exitosa', 'success');
    } catch (err) {
      console.error('Error executing action:', err);
      showNotification('Error al ejecutar la operación', 'error');
      setConfirmAction(null);
    }
  };

  const handleReturnLoan = (loanId) => {
    handleActionWithConfirm(
      loanService.returnLoan,
      loanId,
      '¿Está seguro de que desea marcar este préstamo como devuelto?'
    );
  };

  const handleRenewLoan = (loanId) => {
    handleActionWithConfirm(
      loanService.renewLoan,
      loanId,
      '¿Está seguro de que desea renovar este préstamo?'
    );
  };

  const handleCancelLoan = (loanId) => {
    handleActionWithConfirm(
      loanService.cancelLoan,
      loanId,
      '¿Está seguro de que desea cancelar este préstamo?'
    );
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

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const exportLoans = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Lector,Libro,Fecha Préstamo,Fecha Vencimiento,Estado\n"
      + filteredLoans.map(loan => 
          `${loan.id},${loan.reader?.name || 'N/A'},${loan.book?.title || 'N/A'},${loan.createdAt},${loan.dueDate},${loan.status}`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `prestamos_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calcular estadísticas
  const stats = {
    total: filteredLoans.length,
    active: filteredLoans.filter(loan => loan.status === 'ACTIVE').length,
    overdue: filteredLoans.filter(loan => loan.status === 'OVERDUE').length,
    returned: filteredLoans.filter(loan => loan.status === 'RETURNED').length
  };

  // Ordenar datos
  const sortedLoans = React.useMemo(() => {
    let sortableLoans = [...filteredLoans];
    if (sortConfig.key) {
      sortableLoans.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableLoans;
  }, [filteredLoans, sortConfig]);

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLoans = sortedLoans.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLoans.length / itemsPerPage);

  if (loading && loans.length === 0) {
    return (
      <div className="admin-loans-page">
        <div className="loading-container">
          <LoadingSpinner />
          <p>Cargando préstamos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-loans-page">
      {/* Notificaciones */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification({ show: false, message: '', type: '' })}>×</button>
        </div>
      )}

      {/* Modal de confirmación */}
      {confirmAction && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar acción</h3>
            <p>{confirmAction.message}</p>
            <div className="modal-actions">
              <button 
                onClick={() => setConfirmAction(null)}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button 
                onClick={executeAction}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>Administrar Préstamos</h1>
          <div className="header-actions">
            <button 
              onClick={exportLoans}
              className="btn btn-outline"
              disabled={filteredLoans.length === 0}
            >
              📊 Exportar
            </button>
            <button 
              onClick={loadLoans}
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? '🔄 Cargando...' : '🔄 Actualizar'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.active}</h3>
            <p>Activos</p>
          </div>
        </div>
        <div className={`stat-card ${stats.overdue > 0 ? 'alert' : ''}`}>
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>{stats.overdue}</h3>
            <p>Vencidos</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📖</div>
          <div className="stat-info">
            <h3>{stats.returned}</h3>
            <p>Devueltos</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <h2>Filtros</h2>
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
              placeholder="Buscar por ID o nombre"
            />
          </div>

          <div className="filter-group">
            <label>ID Libro:</label>
            <input
              type="text"
              name="bookId"
              value={filters.bookId}
              onChange={handleFilterChange}
              placeholder="Buscar por ID o título"
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

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <div className="alert-content">
            <strong>Error:</strong> {error}
            <button 
              onClick={loadLoans}
              className="btn btn-sm btn-outline"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Controles de ordenación */}
      <div className="sort-controls">
        <span>Ordenar por:</span>
        <button 
          onClick={() => handleSort('createdAt')}
          className={`sort-btn ${sortConfig.key === 'createdAt' ? 'active' : ''}`}
        >
          Fecha {sortConfig.key === 'createdAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
        </button>
        <button 
          onClick={() => handleSort('dueDate')}
          className={`sort-btn ${sortConfig.key === 'dueDate' ? 'active' : ''}`}
        >
          Vencimiento {sortConfig.key === 'dueDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
        </button>
        <button 
          onClick={() => handleSort('status')}
          className={`sort-btn ${sortConfig.key === 'status' ? 'active' : ''}`}
        >
          Estado {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
        </button>
      </div>

      {/* Results */}
      <div className="results-section">
        <div className="results-header">
          <p className="results-info">
            Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredLoans.length)} de {filteredLoans.length} préstamos
          </p>
          {loading && (
            <div className="inline-loading">
              <LoadingSpinner />
              <span>Actualizando...</span>
            </div>
          )}
        </div>

        {filteredLoans.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No hay préstamos disponibles</h3>
            <p>No se encontraron préstamos que coincidan con los filtros seleccionados.</p>
            {Object.values(filters).some(value => value) && (
              <button 
                onClick={resetFilters}
                className="btn btn-primary"
              >
                Limpiar Filtros
              </button>
            )}
          </div>
        ) : (
          <>
            <LoanList
              loans={currentLoans}
              onReturnLoan={handleReturnLoan}
              onRenewLoan={handleRenewLoan}
              onCancelLoan={handleCancelLoan}
              showAdminActions={true}
            />
            
            {/* Paginación */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn btn-outline"
                >
                  ← Anterior
                </button>
                
                <div className="page-numbers">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn btn-outline"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminLoansPage;