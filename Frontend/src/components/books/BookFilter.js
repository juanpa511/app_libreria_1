import React, { useState } from 'react';
import '../../styles/BookFilter.css';

const BookFilter = ({ onFilterChange, onSearchChange, filters: initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    type: initialFilters.type || '',
    availability: initialFilters.availability || '',
    searchTerm: initialFilters.searchTerm || ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = (filterName, value) => {
    const newFilters = {
      ...filters,
      [filterName]: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const newFilters = {
      ...filters,
      searchTerm: value
    };
    setFilters(newFilters);
    onSearchChange(value);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      type: '',
      availability: '',
      searchTerm: ''
    };
    setFilters(emptyFilters);
    setSearchTerm('');
    onFilterChange(emptyFilters);
    onSearchChange('');
  };

  // Tipos de libros según los requerimientos del proyecto
  const bookTypes = [
    { value: '', label: 'Todos los tipos' },
    { value: 'educacion', label: 'Educación' },
    { value: 'novela', label: 'Novela' },
    { value: 'aventura', label: 'Aventura' },
    { value: 'poemas', label: 'Poemas' },
    { value: 'ciencia', label: 'Ciencia' },
    { value: 'historia', label: 'Historia' },
    { value: 'arte', label: 'Arte' },
    { value: 'tecnologia', label: 'Tecnología' }
  ];

  // Estados de disponibilidad
  const availabilityOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'available', label: 'Disponible' },
    { value: 'borrowed', label: 'En préstamo' }
  ];

  return (
    <div className="book-filter">
      <div className="filter-section">
        <h3>Filtros de Búsqueda</h3>
        
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por título o autor..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-grid">
          <div className="filter-group">
            <label>Tipo de Libro</label>
            <select 
              value={filters.type} 
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              {bookTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Disponibilidad</label>
            <select 
              value={filters.availability} 
              onChange={(e) => handleFilterChange('availability', e.target.value)}
            >
              {availabilityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-actions">
          <button 
            className="btn btn-clear"
            onClick={clearFilters}
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookFilter;