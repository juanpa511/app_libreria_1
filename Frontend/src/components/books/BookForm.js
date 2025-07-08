import React, { useState } from 'react';
import '../../styles/BookForm.css';

const BookForm = ({ onSubmit, loading = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    author: initialData?.author || '',
    type: initialData?.type || '',
    isbn: initialData?.isbn || '',
    image64: initialData?.image64 || ''
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

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file' && files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image64: e.target.result
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
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
    
    if (!formData.type) {
      newErrors.type = 'El tipo de libro es requerido';
    }
    
    if (!formData.isbn.trim()) {
      newErrors.isbn = 'El ISBN es requerido';
    } else if (!/^[0-9]{10}([0-9]{3})?$/.test(formData.isbn.replace(/-/g, ''))) {
      newErrors.isbn = 'El ISBN debe tener 10 o 13 dígitos';
    }
    
    if (!formData.image64) {
      newErrors.image64 = 'La imagen es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Enviar la imagen como string base64 puro (sin el prefijo data:image/...;base64,)
      let imageBase64 = null;
      if (formData.image64) {
        try {
          imageBase64 = formData.image64.split(',')[1]; // Remover el prefijo data:image/...;base64,
        } catch (error) {
          console.error('Error procesando imagen:', error);
          alert('Error al procesar la imagen. Por favor, selecciona otra imagen.');
          return;
        }
      }
      
      const dataToSend = {
        title: formData.title,
        author: formData.author,
        type: formData.type,
        isbn: formData.isbn,
        image64: imageBase64
      };
      
      onSubmit(dataToSend);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      type: '',
      isbn: '',
      image64: ''
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
          <h3>Información del Libro</h3>
          
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

            <div className="form-group">
              <label htmlFor="isbn">ISBN *</label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className={errors.isbn ? 'error' : ''}
                placeholder="Ingrese el ISBN del libro"
                maxLength="13"
              />
              {errors.isbn && <span className="error-message">{errors.isbn}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="image">Imagen del Libro *</label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleChange}
                className={errors.image64 ? 'error' : ''}
                accept="image/*"
              />
              {errors.image64 && <span className="error-message">{errors.image64}</span>}
              {formData.image64 && (
                <div className="image-preview">
                  <img src={formData.image64} alt="Vista previa" style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '10px' }} />
                </div>
              )}
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