import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import fineService from '../../services/fineService';
import FineList from '../../components/fines/FineList';
import FineForm from '../../components/fines/FineForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../../styles/AdminFinesPage.css';

const AdminFinesPage = () => {
  const [fines, setFines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedFine, setSelectedFine] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    readerId: '',
    startDate: '',
    endDate: ''
  });

  const { loading, error, execute } = useApi();

  useEffect(() => {
    loadFines();
  }, [filters]);

  const loadFines = async () => {
    try {
      const response = await execute(() => fineService.getAllFines(filters));
      setFines(response || []);
    } catch (err) {
      console.error('Error loading fines:', err);
    }
  };

  const handleCreateFine = async (fineData) => {
    try {
      await execute(() => fineService.createFine(fineData));
      setShowForm(false);
      loadFines();
      alert('Multa creada exitosamente');
    } catch (err) {
      console.error('Error creating fine:', err);
      alert('Error al crear la multa');
    }
  };

  const handleUpdateFine = async (fineData) => {
    try {
      await execute(() => fineService.updateFine(selectedFine.id, fineData));
      setShowForm(false);
      setSelectedFine(null);
      loadFines();
      alert('Multa actualizada exitosamente');
    } catch (err) {
      console.error('Error updating fine:', err);
      alert('Error al actualizar la multa');
    }
  };

  const handlePayFine = async (fineId) => {
    try {
      await execute(() => fineService.payFine(fineId));
      loadFines();
      alert('Multa pagada exitosamente');
    } catch (err) {
      console.error('Error paying fine:', err);
      alert('Error al pagar la multa');
    }
  };

  const handleDeleteFine = async (fineId) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta multa?')) {
      try {
        await execute(() => fineService.deleteFine(fineId));
        loadFines();
        alert('Multa eliminada exitosamente');
      } catch (err) {
        console.error('Error deleting fine:', err);
        alert('Error al eliminar la multa');
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      readerId: '',
      startDate: '',
      endDate: ''
    });
  };

  const handleEditFine = (fine) => {
    setSelectedFine(fine);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedFine(null);
  };

  if (showForm) {
    return (
      <div className="admin-fines-page">
        <div className="page-header">
          <button 
            onClick={handleCloseForm}
            className="btn btn-secondary"
          >
            ← Volver a la Lista
          </button>
        </div>
        
        <FineForm
          onSubmit={selectedFine ? handleUpdateFine : handleCreateFine}
          initialData={selectedFine}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <div className="admin-fines-page">
      <div className="page-header">
        <h1>Administrar Multas</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          + Nueva Multa
        </button>
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
              <option value="PENDING">Pendiente</option>
              <option value="PAID">Pagada</option>
              <option value="CANCELLED">Cancelada</option>
            </select>
          </div>

          <div className="filter-group">
            <label>ID Lector:</label>
            <input
              type="text"
              name="readerId"
              value={filters.readerId}
              onChange={handleFilterChange}
              placeholder="Buscar por ID"
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
        <FineList
          fines={fines}
          onPayFine={handlePayFine}
          onEditFine={handleEditFine}
          onDeleteFine={handleDeleteFine}
          showAdminActions={true}
        />
      )}
    </div>
  );
};

export default AdminFinesPage;