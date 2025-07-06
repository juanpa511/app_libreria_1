import React, { useState } from 'react';
import '../styles/FineForm.css';

const FineForm = ({ onSubmit, initialData = null, loading = false }) => {
  const [formData, setFormData] = useState({
    readerId: initialData?.readerId || '',
    amount: initialData?.amount || '',
    reason: initialData?.reason || '',
    description: initialData?.description || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario comience a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.readerId.trim()) {
      newErrors.readerId = 'ID del lector es requerido';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'La razón es requerida';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        amount: parseFloat(formData.amount)
      });
    }
  };

  return (
    <div className="fine-form-container">
      <div className="fine-form-header">
        <h2>{initialData ? 'Editar Multa' : 'Crear Nueva Multa'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="fine-form">
        <div className="form-group">
          <label htmlFor="readerId">ID del Lector *</label>
          <input
            type="text"
            id="readerId"
            name="readerId"
            value={formData.readerId}
            onChange={handleChange}
            className={errors.readerId ? 'error' : ''}
            placeholder="Ingrese el ID del lector"
            disabled={loading}
          />
          {errors.readerId && (
            <span className="error-message">{errors.readerId}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="amount">Monto (CLP) *</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className={errors.amount ? 'error' : ''}
            placeholder="0"
            min="0"
            step="100"
            disabled={loading}
          />
          {errors.amount && (
            <span className="error-message">{errors.amount}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="reason">Razón *</label>
          <select
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className={errors.reason ? 'error' : ''}
            disabled={loading}
          >
            <option value="">Seleccione una razón</option>
            <option value="LATE_RETURN">Devolución tardía</option>
            <option value="DAMAGED_BOOK">Libro dañado</option>
            <option value="LOST_BOOK">Libro perdido</option>
            <option value="OTHER">Otro</option>
          </select>
          {errors.reason && (
            <span className="error-message">{errors.reason}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? 'error' : ''}
            placeholder="Describa los detalles de la multa"
            rows="4"
            disabled={loading}
          />
          {errors.description && (
            <span className="error-message">{errors.description}</span>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Procesando...' : (initialData ? 'Actualizar Multa' : 'Crear Multa')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FineForm;