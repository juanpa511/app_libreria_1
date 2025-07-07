import React, { useState, useEffect } from 'react';
import loanService from '../../services/loanService';
import '../styles/ReturnForm.css'; 

const ReturnForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    loanId: '',
    returnDate: new Date().toISOString().split('T')[0],
    condition: 'good',
    notes: ''
  });
  
  const [activeLoans, setActiveLoans] = useState([]);
  const [loadingLoans, setLoadingLoans] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadActiveLoans();
  }, []);

  const loadActiveLoans = async () => {
    setLoadingLoans(true);
    try {
      const loans = await loanService.getActiveLoans();
      setActiveLoans(loans);
    } catch (error) {
      console.error('Error al cargar préstamos activos:', error);
    } finally {
      setLoadingLoans(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.loanId) {
      newErrors.loanId = 'Debe seleccionar un préstamo';
    }
    
    if (!formData.returnDate) {
      newErrors.returnDate = 'Debe especificar la fecha de devolución';
    }
    
    if (!formData.condition) {
      newErrors.condition = 'Debe especificar la condición del libro';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="return-form-container">
      <h2>Procesar Devolución</h2>
      
      <form onSubmit={handleSubmit} className="return-form">
        <div className="form-group">
          <label htmlFor="loanId">Préstamo a devolver:</label>
          <select
            id="loanId"
            name="loanId"
            value={formData.loanId}
            onChange={handleChange}
            className={errors.loanId ? 'error' : ''}
            disabled={loadingLoans}
          >
            <option value="">Seleccione un préstamo</option>
            {activeLoans.map(loan => (
              <option key={loan.id} value={loan.id}>
                {loan.bookTitle} - {loan.readerName} 
                {isOverdue(loan.dueDate) && ' (VENCIDO)'}
                - Vence: {formatDate(loan.dueDate)}
              </option>
            ))}
          </select>
          {errors.loanId && <span className="error-message">{errors.loanId}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="returnDate">Fecha de Devolución:</label>
            <input
              type="date"
              id="returnDate"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleChange}
              className={errors.returnDate ? 'error' : ''}
            />
            {errors.returnDate && <span className="error-message">{errors.returnDate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="condition">Condición del Libro:</label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className={errors.condition ? 'error' : ''}
            >
              <option value="excellent">Excelente</option>
              <option value="good">Buena</option>
              <option value="fair">Regular</option>
              <option value="poor">Mala</option>
              <option value="damaged">Dañado</option>
            </select>
            {errors.condition && <span className="error-message">{errors.condition}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Observaciones (opcional):</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            placeholder="Ingrese cualquier observación sobre la devolución..."
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || loadingLoans}
          >
            {loading ? 'Procesando...' : 'Procesar Devolución'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReturnForm;