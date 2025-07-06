import React, { useState } from 'react';
import '../styles/BookForm.css'; 

const BookForm = ({ onSubmit, loading, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    author: initialData?.author || '',
    isbn: initialData?.isbn || '',
    genre: initialData?.genre || '',
    description: initialData?.description || '',
    publishedYear: initialData?.publishedYear || '',
    publisher: initialData?.publisher || '',
    pages: initialData?.pages || '',
    language: initialData?.language || 'es',
    copies: initialData?.copies || 1,
    available: initialData?.available !== undefined ? initialData.available : true
  });
  
  const [errors, setErrors] = useState({});

  const genres = [
    'Ficción', 'No ficción', 'Ciencia ficción', 'Fantasía', 'Misterio',
    'Romance', 'Thriller', 'Historia', 'Biografía', 'Autoayuda',
    'Ciencia', 'Tecnología', 'Arte', 'Filosofía', 'Poesía'
  ];

  const languages = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'Inglés' },
    { code: 'fr', name: 'Francés' },
    { code: 'de', name: 'Alemán' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Portugués' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'El autor es requerido';
    }
    
    if (!formData.isbn.trim()) {
      newErrors.isbn = 'El ISBN es requerido';
    } else if (!/^\d{10}(\d{3})?$/.test(formData.isbn.replace(/-/g, ''))) {
      newErrors.isbn = 'El ISBN debe tener 10 o 13 dígitos';
    }
    
    if (!formData.genre) {
      newErrors.genre = 'El género es requerido';
    }
    
    if (formData.publishedYear && (formData.publishedYear < 1000 || formData.publishedYear > new Date().getFullYear())) {
      newErrors.publishedYear = 'El año de publicación no es válido';
    }
    
    if (formData.pages && (formData.pages < 1 || formData.pages > 10000)) {
      newErrors.pages = 'El número de páginas debe estar entre 1 y 10000';
    }
    
    if (formData.copies < 1) {
      newErrors.copies = 'Debe haber al menos 1 copia';
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
    <div className="book-form-container">
      <h2>{initialData ? 'Editar Libro' : 'Crear Nuevo Libro'}</h2>
      
      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
              placeholder="Ingrese el título del libro"
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="author">Autor *</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className={errors.author ? 'error' : ''}
              placeholder="Ingrese el nombre del autor"
            />
            {errors.author && <span className="error-message">{errors.author}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="isbn">ISBN *</label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              className={errors.isbn ? 'error' : ''}
              placeholder="978-0-123456-78-9"
            />
            {errors.isbn && <span className="error-message">{errors.isbn}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="genre">Género *</label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className={errors.genre ? 'error' : ''}
            >
              <option value="">Seleccione un género</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            {errors.genre && <span className="error-message">{errors.genre}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Ingrese una descripción del libro..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="publishedYear">Año de Publicación</label>
            <input
              type="number"
              id="publishedYear"
              name="publishedYear"
              value={formData.publishedYear}
              onChange={handleChange}
              className={errors.publishedYear ? 'error' : ''}
              min="1000"
              max={new Date().getFullYear()}
            />
            {errors.publishedYear && <span className="error-message">{errors.publishedYear}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="publisher">Editorial</label>
            <input
              type="text"
              id="publisher"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              placeholder="Ingrese la editorial"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="pages">Páginas</label>
            <input
              type="number"
              id="pages"
              name="pages"
              value={formData.pages}
              onChange={handleChange}
              className={errors.pages ? 'error' : ''}
              min="1"
              max="10000"
            />
            {errors.pages && <span className="error-message">{errors.pages}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="language">Idioma</label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="copies">Número de Copias *</label>
            <input
              type="number"
              id="copies"
              name="copies"
              value={formData.copies}
              onChange={handleChange}
              className={errors.copies ? 'error' : ''}
              min="1"
            />
            {errors.copies && <span className="error-message">{errors.copies}</span>}
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
              />
              <span className="checkbox-text">Disponible para préstamo</span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : (initialData ? 'Actualizar Libro' : 'Crear Libro')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;