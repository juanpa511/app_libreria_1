import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookForm from '../components/books/BookForm';
import bookService from '../services/bookService';
import '../styles/CreateBookPage.css'; 

const CreateBookPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    
    try {
      await bookService.createBook(formData);
      navigate('/admin/books', { 
        state: { message: 'Libro creado exitosamente' } 
      });
    } catch (err) {
      setError(err.message || 'Error al crear el libro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-book-page">
      <div className="page-header">
        <h1>Crear Nuevo Libro</h1>
        <button 
          className="btn-secondary"
          onClick={() => navigate('/admin/books')}
        >
          Volver a Libros
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <BookForm 
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default CreateBookPage;
