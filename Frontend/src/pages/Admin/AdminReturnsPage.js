import React, { useState, useEffect, useCallback } from 'react';
import { useApi } from '../../hooks/useApi';
import loanService from '../../services/loanService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Layout from '../../components/common/Layout';
import { useAuth } from '../../context/AuthContext';
import ReturnsStats from '../../components/admin/ReturnsStats';
import '../../styles/AdminReturnsPage.css';

const AdminReturnsPage = () => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all', // all, active, returned, overdue
    readerEmail: '',
    bookTitle: '',
    startDate: '',
    endDate: ''
  });
  const [pendingFilters, setPendingFilters] = useState({
    status: 'all',
    readerEmail: '',
    bookTitle: '',
    startDate: '',
    endDate: ''
  });
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnLoading, setReturnLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('table'); // 'table' o 'stats'

  const { loading, error, handleApiCall } = useApi();
  const { user, isAdmin } = useAuth();

  // Función para mapear datos del backend a la estructura esperada por el frontend
  const mapBookingToLoan = (booking) => {
    const now = new Date();
    const dueDate = new Date(booking.dateReturn);
    // Cambiar interpretación: 0 = ACTIVO, 1 = RETURNED
    const isActive = booking.state === 0;
    const isReturned = booking.state === 1;
    const isOverdue = isActive && dueDate < now;
    return {
      id: booking.idBooking,
      bookTitle: booking.copyBook?.book?.title || 'Título no disponible',
      bookAuthor: booking.copyBook?.book?.author || 'N/A',
      bookIsbn: booking.copyBook?.book?.isbn || 'N/A',
      readerName: booking.user?.name || booking.user?.email || 'N/A',
      readerEmail: booking.user?.email || 'N/A',
      loanDate: booking.dateBooking,
      dueDate: booking.dateReturn,
      returnDate: isReturned ? booking.dateReturn : null,
      status: isActive ? (isOverdue ? 'OVERDUE' : 'ACTIVE') : 'RETURNED',
      state: booking.state,
      originalBooking: booking,
      idBooking: booking.idBooking,
      user: booking.user,
      copyBook: booking.copyBook
    };
  };

  // Cargar préstamos
  const loadLoans = useCallback(async () => {
    try {
      const response = await handleApiCall(loanService.getAllLoans);
      if (response) {
        const mappedLoans = response.map(mapBookingToLoan);
        setLoans(mappedLoans);
        applyFilters(mappedLoans);
      }
    } catch (err) {
      console.error('Error loading loans:', err);
    }
  }, [handleApiCall]);

  useEffect(() => {
    loadLoans();
  }, [loadLoans]);

  useEffect(() => {
    applyFilters();
  }, [loans, filters]);

  const applyFilters = (loansToFilter = loans) => {
    let filtered = [...loansToFilter];

    // Filtro por estado
    if (filters.status !== 'all') {
      switch (filters.status) {
        case 'active':
          filtered = filtered.filter(loan => loan.status === 'ACTIVE');
          break;
        case 'returned':
          filtered = filtered.filter(loan => loan.status === 'RETURNED');
          break;
        case 'overdue':
          filtered = filtered.filter(loan => loan.status === 'OVERDUE');
          break;
        default:
          break;
      }
    }

    // Filtro por email del lector
    if (filters.readerEmail) {
      filtered = filtered.filter(loan =>
        loan.readerEmail.toLowerCase().includes(filters.readerEmail.toLowerCase())
      );
    }

    // Filtro por título del libro
    if (filters.bookTitle) {
      filtered = filtered.filter(loan =>
        loan.bookTitle.toLowerCase().includes(filters.bookTitle.toLowerCase())
      );
    }

    // Filtro por fecha de préstamo
    if (filters.startDate) {
      filtered = filtered.filter(loan =>
        new Date(loan.loanDate) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(loan =>
        new Date(loan.loanDate) <= new Date(filters.endDate)
      );
    }

    setFilteredLoans(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setPendingFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyPendingFilters = () => {
    setFilters({ ...pendingFilters });
  };

  const resetFilters = () => {
    const resetFilters = {
      status: 'all',
      readerEmail: '',
      bookTitle: '',
      startDate: '',
      endDate: ''
    };
    setFilters(resetFilters);
    setPendingFilters(resetFilters);
  };

  const handleReturnLoan = async (loanId) => {
    try {
      setReturnLoading(true);
      await handleApiCall(loanService.returnLoan, loanId);
      setShowReturnModal(false);
      setSelectedLoan(null);
      loadLoans();
      alert('Libro devuelto exitosamente');
    } catch (err) {
      console.error('Error returning loan:', err);
      alert(`Error al devolver el libro: ${err.message}`);
    } finally {
      setReturnLoading(false);
    }
  };

  const openReturnModal = (loan) => {
    setSelectedLoan(loan);
    setShowReturnModal(true);
  };

  const closeReturnModal = () => {
    setShowReturnModal(false);
    setSelectedLoan(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'ACTIVE': { text: 'Activo', className: 'badge-success' },
      'RETURNED': { text: 'Devuelto', className: 'badge-info' },
      'OVERDUE': { text: 'Vencido', className: 'badge-danger' }
    };
    
    const config = statusConfig[status] || { text: status, className: 'badge-secondary' };
    return <span className={`badge ${config.className}`}>{config.text}</span>;
  };

  const getDaysLate = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = now - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Estadísticas
  const stats = {
    total: loans.length,
    active: loans.filter(loan => loan.status === 'ACTIVE').length,
    returned: loans.filter(loan => loan.status === 'RETURNED').length,
    overdue: loans.filter(loan => loan.status === 'OVERDUE').length,
    totalOverdueDays: loans
      .filter(loan => loan.status === 'OVERDUE')
      .reduce((total, loan) => total + getDaysLate(loan.dueDate), 0)
  };

  const showTable = activeTab === 'table';

  return (
    <Layout>
      <div className="admin-returns-page">
        <div className="page-header">
          <h1>📤 Gestión de Devoluciones</h1>
          <p>Administra las devoluciones de libros y monitorea el estado de los préstamos</p>
        </div>

        {/* Pestañas de navegación */}
        <div className="tabs-navigation">
          <button
            className={`tab-button ${activeTab === 'table' ? 'active' : ''}`}
            onClick={() => setActiveTab('table')}
          >
            📋 Tabla de Préstamos
          </button>
          <button
            className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            📊 Estadísticas Detalladas
          </button>
        </div>

        {/* Estadísticas básicas */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <h3>Total Préstamos</h3>
              <p className="stat-number">{stats.total}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔄</div>
            <div className="stat-content">
              <h3>Préstamos Activos</h3>
              <p className="stat-number">{stats.active}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Libros Devueltos</h3>
              <p className="stat-number">{stats.returned}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <h3>Préstamos Vencidos</h3>
              <p className="stat-number">{stats.overdue}</p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Estado:</label>
              <select
                name="status"
                value={pendingFilters.status}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="returned">Devueltos</option>
                <option value="overdue">Vencidos</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Email del Lector:</label>
              <input
                type="text"
                name="readerEmail"
                value={pendingFilters.readerEmail}
                onChange={handleFilterChange}
                placeholder="Buscar por email..."
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label>Título del Libro:</label>
              <input
                type="text"
                name="bookTitle"
                value={pendingFilters.bookTitle}
                onChange={handleFilterChange}
                placeholder="Buscar por título..."
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label>Fecha Desde:</label>
              <input
                type="date"
                name="startDate"
                value={pendingFilters.startDate}
                onChange={handleFilterChange}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label>Fecha Hasta:</label>
              <input
                type="date"
                name="endDate"
                value={pendingFilters.endDate}
                onChange={handleFilterChange}
                className="filter-input"
              />
            </div>
          </div>

          <div className="filter-actions">
            <button onClick={applyPendingFilters} className="btn btn-primary">
              Aplicar Filtros
            </button>
            <button onClick={resetFilters} className="btn btn-secondary">
              Limpiar Filtros
            </button>
          </div>

          <div className="results-info">
            Mostrando {filteredLoans.length} de {loans.length} préstamos
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
          </div>
        )}

        {/* Contenido de las pestañas */}
        {showTable && (
          <>
            <div className="loans-container" style={{ position: 'relative' }}>
              {loading && (
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.7)', zIndex: 2
                }}>
                  <LoadingSpinner />
                </div>
              )}
              <div className="loans-table" style={{ opacity: loading ? 0.5 : 1 }}>
                <table>
                  <thead>
                    <tr>
                      <th>Libro</th>
                      <th>Lector</th>
                      <th>Fecha Préstamo</th>
                      <th>Fecha Vencimiento</th>
                      <th>Estado</th>
                      <th>Días Vencido</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLoans.length === 0 && !loading ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', color: '#888' }}>
                          No se encontraron préstamos
                        </td>
                      </tr>
                    ) : (
                      filteredLoans.map((loan) => (
                        <tr
                          key={loan.id}
                          className={
                            loan.status === 'OVERDUE'
                              ? 'overdue-row'
                              : loan.status === 'ACTIVE'
                              ? 'active-row'
                              : loan.status === 'RETURNED'
                              ? 'returned-row'
                              : ''
                          }
                        >
                          <td>
                            <div className="book-info">
                              <strong>{loan.bookTitle}</strong>
                              <small>{loan.bookAuthor}</small>
                            </div>
                          </td>
                          <td>
                            <div className="reader-info">
                              <div>{loan.readerName}</div>
                              <small>{loan.readerEmail}</small>
                            </div>
                          </td>
                          <td>{formatDate(loan.loanDate)}</td>
                          <td>{formatDate(loan.dueDate)}</td>
                          <td>{getStatusBadge(loan.status)}</td>
                          <td>
                            {loan.status === 'OVERDUE' ? (
                              <span className="days-late">
                                {getDaysLate(loan.dueDate)} días
                              </span>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td>
                            {loan.status === 'ACTIVE' || loan.status === 'OVERDUE' ? (
                              <button
                                onClick={() => openReturnModal(loan)}
                                className="btn btn-success btn-sm"
                              >
                                📤 Devolver
                              </button>
                            ) : (
                              <span className="text-muted">Ya devuelto</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'stats' && (
          <ReturnsStats loans={loans} />
        )}

        {/* Modal de confirmación de devolución */}
        {showReturnModal && selectedLoan && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Confirmar Devolución</h3>
                <button onClick={closeReturnModal} className="modal-close">&times;</button>
              </div>
              <div className="modal-body">
                <p>¿Está seguro de que desea procesar la devolución del siguiente libro?</p>
                <div className="return-details">
                  <p><strong>Libro:</strong> {selectedLoan.bookTitle}</p>
                  <p><strong>Lector:</strong> {selectedLoan.readerName} ({selectedLoan.readerEmail})</p>
                  <p><strong>Fecha de préstamo:</strong> {formatDate(selectedLoan.loanDate)}</p>
                  <p><strong>Fecha de vencimiento:</strong> {formatDate(selectedLoan.dueDate)}</p>
                  {selectedLoan.status === 'OVERDUE' && (
                    <p className="overdue-warning">
                      ⚠️ Este préstamo está vencido por {getDaysLate(selectedLoan.dueDate)} días. 
                      Se aplicará una multa automáticamente.
                    </p>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={closeReturnModal} className="btn btn-secondary">
                  Cancelar
                </button>
                <button
                  onClick={() => handleReturnLoan(selectedLoan.id)}
                  className="btn btn-success"
                  disabled={returnLoading}
                >
                  {returnLoading ? 'Procesando...' : 'Confirmar Devolución'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminReturnsPage; 