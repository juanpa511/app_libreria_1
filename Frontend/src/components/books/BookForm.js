import React, { useState } from 'react';
import '../../styles/BookForm.css';

const BookForm = ({ onSubmit, loading = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    author: initialData?.author || '',
    isbn: initialData?.isbn || '',
    type: initialData?.type || '',
    description: initialData?.description || '',
    publishedYear: initialData?.publishedYear || '',
    publisher: initialData?.publisher || '',
    pages: initialData?.pages || '',
    language: initialData?.language || 'es',
    copies: initialData?.copies || 1,
    available: initialData?.available !== undefined ? initialData.available : true
  });
  
  const [errors, setErrors] = useState({});

  // Tipos de libros según el requerimiento
  const bookTypes = [
    { value: '', label: 'Seleccione un tipo' },
    { value: 'educacion', label: 'Educación' },
    { value: 'novela', label: 'Novela' },
    { value: 'aventura', label: 'Aventura' },
    { value: 'poemas', label: 'Poemas' },
    { value: 'ciencia', label: 'Ciencia' },
    { value: 'historia', label: 'Historia' },
    { value: 'arte', label: 'Arte' },
    { value: 'tecnologia', label: 'Tecnología' }
  ];

  const languages = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'Inglés' },
    { code: 'fr', name: 'Francés' },
    { code: 'de', name: 'Alemán' },
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
    
    if (!formData.type) {
      newErrors.type = 'El tipo de libro es requerido';
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
      // Preparar datos para envío
      const dataToSend = {
        ...formData,
        publishedYear: formData.publishedYear ? parseInt(formData.publishedYear) : null,
        pages: formData.pages ? parseInt(formData.pages) : null,
        copies: parseInt(formData.copies),
        available: formData.available
      };
      onSubmit(dataToSend);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      type: '',
      description: '',
      publishedYear: '',
      publisher: '',
      pages: '',
      language: 'es',
      copies: 1,
      available: true
    });
    setErrors({});
  };

  return (
    <div className="book-form-container">
      <div className="form-header">
        <h2>{initialData ? 'Editar Libro' : 'Crear Nuevo Libro'}</h2>
        <p>Complete todos los campos requeridos para {initialData ? 'actualizar' : 'agregar'} el libro</p>
      </div>
      
      <div className="book-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Información Básica</h3>
          
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
                maxLength="200"
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
                maxLength="150"
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
                maxLength="17"
              />
              {errors.isbn && <span className="error-message">{errors.isbn}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="type">Tipo de Libro *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={errors.type ? 'error' : ''}
              >
                {bookTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              {errors.type && <span className="error-message">{errors.type}</span>}
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
              maxLength="500"
            />
            <small>{formData.description.length}/500 caracteres</small>
          </div>
        </div>

        <div className="form-section">
          <h3>Detalles de Publicación</h3>
          
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
                placeholder="2024"
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
                maxLength="100"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pages">Número de Páginas</label>
              <input
                type="number"
                id="pages"
                name="pages"
                value={formData.pages}
                onChange={handleChange}
                className={errors.pages ? 'error' : ''}
                min="1"
                max="10000"
                placeholder="150"
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
        </div>

        <div className="form-section">
          <h3>Disponibilidad</h3>
          
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
                max="100"
              />
              {errors.copies && <span className="error-message">{errors.copies}</span>}
            </div>

            <div className="form-group">
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleChange}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">Disponible para préstamo</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={resetForm}
            disabled={loading}
          >
            Limpiar Formulario
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Guardando...
              </>
            ) : (
              initialData ? 'Actualizar Libro' : 'Crear Libro'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookForm;