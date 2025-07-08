import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/CreateLoanModal.css';

const CreateLoanModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    userEmail: '',
    bookTitle: '',
    copyBookId: ''
  });
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [availableCopies, setAvailableCopies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadUsers();
      loadBooks();
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.bookTitle) {
      loadAvailableCopies(formData.bookTitle);
    } else {
      setAvailableCopies([]);
    }
  }, [formData.bookTitle]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllUsers();
      setUsers(response || []);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllBooks();
      setBooks(response || []);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableCopies = async (title) => {
    try {
      setLoading(true);
      const response = await apiService.getAvailableCopies(title);
      setAvailableCopies(response || []);
    } catch (error) {
      console.error('Error loading available copies:', error);
      setAvailableCopies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.userEmail.trim()) {
      newErrors.userEmail = 'El email del usuario es requerido';
    }
    
    if (!formData.bookTitle.trim()) {
      newErrors.bookTitle = 'El título del libro es requerido';
    }
    
    if (!formData.copyBookId) {
      newErrors.copyBookId = 'Debe seleccionar un ejemplar';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      const loanData = {
        user: { email: formData.userEmail },
        copyBook: { idCopybook: parseInt(formData.copyBookId) }
      };
      
      await apiService.createBooking(loanData);
      
      // Limpiar formulario
      setFormData({
        userEmail: '',
        bookTitle: '',
        copyBookId: ''
      });
      
      onSuccess();
      onClose();
      
    } catch (error) {
      console.error('Error creating loan:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      userEmail: '',
      bookTitle: '',
      copyBookId: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content create-loan-modal">
        <div className="modal-header">
          <h3>Crear Nuevo Préstamo</h3>
          <button onClick={handleClose} className="close-btn">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="create-loan-form">
          <div className="form-group">
            <label htmlFor="userEmail">Usuario *</label>
            <select
              id="userEmail"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleInputChange}
              className={errors.userEmail ? 'error' : ''}
            >
              <option value="">Seleccione un usuario</option>
              {users.map(user => (
                <option key={user.email} value={user.email}>
                  {user.name} - {user.email} {!user.state ? '(Inactivo)' : ''}
                </option>
              ))}
            </select>
            {errors.userEmail && <span className="error-message">{errors.userEmail}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="bookTitle">Título del Libro *</label>
            <select
              id="bookTitle"
              name="bookTitle"
              value={formData.bookTitle}
              onChange={handleInputChange}
              className={errors.bookTitle ? 'error' : ''}
            >
              <option value="">Seleccione un libro</option>
              {books.map(book => (
                <option key={book.idBook} value={book.title}>
                  {book.title} - {book.author}
                </option>
              ))}
            </select>
            {errors.bookTitle && <span className="error-message">{errors.bookTitle}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="copyBookId">Ejemplar Disponible *</label>
            <select
              id="copyBookId"
              name="copyBookId"
              value={formData.copyBookId}
              onChange={handleInputChange}
              className={errors.copyBookId ? 'error' : ''}
              disabled={!formData.bookTitle || availableCopies.length === 0}
            >
              <option value="">
                {!formData.bookTitle 
                  ? 'Primero seleccione un libro' 
                  : availableCopies.length === 0 
                    ? 'No hay ejemplares disponibles' 
                    : 'Seleccione un ejemplar'
                }
              </option>
              {availableCopies.map(copy => (
                <option key={copy.idCopybook} value={copy.idCopybook}>
                  Ejemplar #{copy.idCopybook} - {copy.state ? 'Disponible' : 'No disponible'}
                </option>
              ))}
            </select>
            {errors.copyBookId && <span className="error-message">{errors.copyBookId}</span>}
          </div>
          
          {errors.submit && (
            <div className="error-message submit-error">
              {errors.submit}
            </div>
          )}
          
          <div className="modal-actions">
            <button 
              type="button" 
              onClick={handleClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? <LoadingSpinner /> : 'Crear Préstamo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLoanModal; 