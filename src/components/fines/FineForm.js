import React, { useState } from 'react';

const FineForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    readerId: initialData?.readerId || '',
    loanId: initialData?.loanId || '',
    amount: initialData?.amount || '',
    reason: initialData?.reason || '',
    dueDate: initialData?.dueDate || '',
    status: initialData?.status || 'PENDING'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.readerId.trim()) {
      newErrors.readerId = 'ID del lector es requerido';
    }

    if (!formData.loanId.trim()) {
      newErrors.loanId = 'ID del préstamo es requerido';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'La razón de la multa es requerida';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'La fecha de vencimiento es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fine-form-container">
      <h2>{initialData ? 'Editar Multa' : 'Crear Nueva Multa'}</h2>
      
      <form onSubmit={handleSubmit} className="fine-form">
        <div className="form-group">
          <label htmlFor="readerId">ID del Lector:</label>
          <input
            type="text"
            id="readerId"
            name="readerId"
            value={formData.readerId}
            onChange={handleChange}
            className={errors.readerId ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.readerId && <span className="error-message">{errors.readerId}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="loanId">ID del Préstamo:</label>
          <input
            type="text"
            id="loanId"
            name="loanId"
            value={formData.loanId}
            onChange={handleChange}
            className={errors.loanId ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.loanId && <span className="error-message">{errors.loanId}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="amount">Monto:</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className={errors.amount ? 'error' : ''}
            disabled={isSubmitting}
            min="0"
            step="0.01"
          />
          {errors.amount && <span className="error-message">{errors.amount}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="reason">Razón de la Multa:</label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className={errors.reason ? 'error' : ''}
            disabled={isSubmitting}
            rows="3"
          />
          {errors.reason && <span className="error-message">{errors.reason}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Fecha de Vencimiento:</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className={errors.dueDate ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="status">Estado:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="PENDING">Pendiente</option>
            <option value="PAID">Pagada</option>
            <option value="CANCELLED">Cancelada</option>
          </select>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : (initialData ? 'Actualizar' : 'Crear Multa')}
          </button>
          
          <button 
            type="button" 
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FineForm;