import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import fineService from '../../services/fineService';
import FineList from '../../components/fines/FineList';
import FineForm from '../../components/fines/FineForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Notification from '../../components/common/Notification';
import '../../styles/AdminFinesPage.css';
import Layout from '../../components/common/Layout';

const AdminFinesPage = () => {
  const [fines, setFines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedFine, setSelectedFine] = useState(null);
  const [notification, setNotification] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    readerEmail: '',
    startDate: '',
    endDate: ''
  });

  const { loading, error, handleApiCall } = useApi();

  useEffect(() => {
    loadFines();
  }, [filters]);

  const loadFines = async () => {
    try {
      const response = await handleApiCall(fineService.getAllFines);
      let filteredFines = response || [];
      
      // Aplicar filtros en el frontend
      if (filters.status !== '') {
        const statusFilter = filters.status === 'true';
        filteredFines = filteredFines.filter(fine => fine.state === statusFilter);
      }
      
      if (filters.readerEmail) {
        filteredFines = filteredFines.filter(fine => 
          fine.user?.email?.toLowerCase().includes(filters.readerEmail.toLowerCase())
        );
      }
      
      setFines(filteredFines);
    } catch (err) {
      console.error('Error loading fines:', err);
    }
  };

  const handleCreateFine = async (fineData) => {
    try {
      await handleApiCall(fineService.createFine, fineData);
      setShowForm(false);
      loadFines();
      setNotification({
        message: 'Multa creada exitosamente',
        type: 'success'
      });
    } catch (err) {
      console.error('Error creating fine:', err);
      const errorMessage = err.message || 'Error al crear la multa';
      setNotification({
        message: `Error al crear la multa: ${errorMessage}`,
        type: 'error'
      });
    }
  };

  const handleUpdateFine = async (fineData) => {
    try {
      await handleApiCall(fineService.updateFine, selectedFine.idFine, fineData);
      setShowForm(false);
      setSelectedFine(null);
      loadFines();
      setNotification({
        message: 'Multa actualizada exitosamente',
        type: 'success'
      });
    } catch (err) {
      console.error('Error updating fine:', err);
      const errorMessage = err.message || 'Error al actualizar la multa';
      setNotification({
        message: `Error al actualizar la multa: ${errorMessage}`,
        type: 'error'
      });
    }
  };

  const handlePayFine = async (fineId) => {
    try {
      await handleApiCall(fineService.payFine, fineId);
      loadFines();
      setNotification({
        message: 'Multa pagada exitosamente',
        type: 'success'
      });
    } catch (err) {
      console.error('Error paying fine:', err);
      const errorMessage = err.message || 'Error al pagar la multa';
      setNotification({
        message: `Error al pagar la multa: ${errorMessage}`,
        type: 'error'
      });
    }
  };

  const handleDeleteFine = async (fineId) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta multa?')) {
      try {
        await handleApiCall(fineService.deleteFine, fineId);
        loadFines();
        setNotification({
          message: 'Multa eliminada exitosamente',
          type: 'success'
        });
      } catch (err) {
        console.error('Error deleting fine:', err);
        const errorMessage = err.message || 'Error al eliminar la multa';
        setNotification({
          message: `Error al eliminar la multa: ${errorMessage}`,
          type: 'error'
        });
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
      readerEmail: '',
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
    <Layout>
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
                <option value="false">Pendiente</option>
                <option value="true">Pagada</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Email Lector:</label>
              <input
                type="email"
                name="readerEmail"
                value={filters.readerEmail}
                onChange={handleFilterChange}
                placeholder="Buscar por email"
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
            isAdmin={true}
          />
        )}
      </div>
      
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </Layout>
  );
};

export default AdminFinesPage;