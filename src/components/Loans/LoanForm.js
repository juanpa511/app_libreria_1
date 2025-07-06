import React, { useState, useEffect } from 'react';
import readerService from '../../services/readerService';
import bookService from '../../services/bookService';
import '../styles/LoanForm.css'; 

const LoanForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    readerId: '',
    bookId: '',
    loanDate: new Date().toISOString().split('T')[0],
    dueDate: ''
  });
  
  const [readers, setReaders] = useState([]);
  const [books, setBooks] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoadingData(true);
    try {
      const [readersData, booksData] = await Promise.all([
        readerService.getAllReaders(),
        bookService.getAllBooks()
      ]);
      setReaders(readersData);
      setBooks(booksData.filter(book => book.available)); // Solo libros disponibles
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoadingData(false);
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
    
    if (!formData.readerId) {
      newErrors.readerId = 'Debe seleccionar un lector';
    }
    
    if (!formData.bookId) {
      newErrors.bookId = 'Debe seleccionar un libro';
    }
    
    if (!formData.loanDate) {
      newErrors.loanDate = 'Debe especificar la fecha de préstamo';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Debe especificar la fecha de vencimiento';
    } else if (new Date(formData.dueDate) <= new Date(formData.loanDate)) {
      newErrors.dueDate = 'La fecha de vencimiento debe ser posterior a la fecha de préstamo';
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

  return (
    <div className="loan-form-container">
      <h2>Crear Nuevo Préstamo</h2>
      
      <form onSubmit={handleSubmit} className="loan-form">
        <div className="form-group">
          <label htmlFor="readerId">Lector:</label>
          <select
            id="readerId"
            name="readerId"
            value={formData.readerId}
            onChange={handleChange}
            className={errors.readerId ? 'error' : ''}
            disabled={loadingData}
          >
            <option value="">Seleccione un lector</option>
            {readers.map(reader => (
              <option key={reader.id} value={reader.id}>
                {reader.name} - {reader.email}
              </option>
            ))}
          </select>
          {errors.readerId && <span className="error-message">{errors.readerId}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="bookId">Libro:</label>
          <select
            id="bookId"
            name="bookId"
            value={formData.bookId}
            onChange={handleChange}
            className={errors.bookId ? 'error' : ''}
            disabled={loadingData}
          >
            <option value="">Seleccione un libro</option>
            {books.map(book => (
              <option key={book.id} value={book.id}>
                {book.title} - {book.author}
              </option>
            ))}
          </select>
          {errors.bookId && <span className="error-message">{errors.bookId}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="loanDate">Fecha de Préstamo:</label>
            <input
              type="date"
              id="loanDate"
              name="loanDate"
              value={formData.loanDate}
              onChange={handleChange}
              className={errors.loanDate ? 'error' : ''}
            />
            {errors.loanDate && <span className="error-message">{errors.loanDate}</span>}
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
            />
            {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || loadingData}
          >
            {loading ? 'Creando...' : 'Crear Préstamo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoanForm;