import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookForm from '../components/books/BookForm';
import bookService from '../services/bookService';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/common/Layout';
import '../styles/CreateBookPage.css'; 

const CreateBookPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  // Verificar si el usuario es ADMIN
  useEffect(() => {
    if (!isAdmin) {
      setError('Acceso denegado. Solo los administradores pueden crear libros.');
    }
  }, [isAdmin]);

  const handleSubmit = async (formData) => {
    if (!isAdmin) {
      setError('Acceso denegado. Solo los administradores pueden crear libros.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      console.log('=== DEBUG INFO ===');
      console.log('Usuario:', user);
      console.log('Es admin:', isAdmin);
      console.log('Token:', localStorage.getItem('token'));
      console.log('Datos a enviar:', formData);
      
      const result = await bookService.createBook(formData);
      console.log('Resultado exitoso:', result);
      navigate('/admin/books', { 
        state: { message: 'Libro creado exitosamente' } 
      });
    } catch (err) {
      console.error('=== ERROR DETALLADO ===');
      console.error('Error completo:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      setError(`Error al crear el libro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
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

        <div className="user-info" style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
          <h4>Información del Usuario:</h4>
          <p><strong>Email:</strong> {user?.email || 'No disponible'}</p>
          <p><strong>Rol ID:</strong> {user?.roleId || 'No disponible'}</p>
          <p><strong>Es Admin:</strong> {isAdmin ? 'Sí' : 'No'}</p>
          <p><strong>Token:</strong> {localStorage.getItem('token') ? 'Presente' : 'Ausente'}</p>
          <button 
            onClick={() => {
              console.log('Usuario completo:', user);
              console.log('Token:', localStorage.getItem('token'));
              console.log('Es admin:', isAdmin);
            }}
            style={{ marginTop: '10px', padding: '5px 10px' }}
          >
            Ver logs en consola
          </button>
        </div>

        <BookForm 
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </Layout>
  );
};

export default CreateBookPage;
