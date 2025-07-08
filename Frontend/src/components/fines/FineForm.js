import React, { useState } from 'react';

const FineForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    user: {
      email: initialData?.user?.email || ''
    },
    amount: initialData?.amount || '',
    description: initialData?.description || '',
    state: initialData?.state || false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.user.email.trim()) {
      newErrors.userEmail = 'Email del lector es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user.email)) {
      newErrors.userEmail = 'Email del lector debe tener un formato válido';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción de la multa es requerida';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
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
          <label htmlFor="userEmail">Email del Lector:</label>
          <input
            type="email"
            id="userEmail"
            name="userEmail"
            value={formData.user.email}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              user: { ...prev.user, email: e.target.value }
            }))}
            className={errors.userEmail ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.userEmail && <span className="error-message">{errors.userEmail}</span>}
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
          <label htmlFor="description">Descripción de la Multa:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? 'error' : ''}
            disabled={isSubmitting}
            rows="3"
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="state">Estado:</label>
          <select
            id="state"
            name="state"
            value={formData.state.toString()}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              state: e.target.value === 'true'
            }))}
            disabled={isSubmitting}
          >
            <option value="false">Pendiente</option>
            <option value="true">Pagada</option>
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