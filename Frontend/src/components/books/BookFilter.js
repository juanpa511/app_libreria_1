import React, { useState } from 'react';
import '../../styles/BookFilter.css';

const BookFilter = ({ onFilterChange, onSearchChange, filters: initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    type: initialFilters.type || '',
    status: initialFilters.status || '',
    genre: initialFilters.genre || '',
    year: initialFilters.year || ''
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
    onSearchChange(value);
  };

  const clearFilters = () => {
    const emptyFilters = {
      type: '',
      status: '',
      genre: '',
      year: ''
    };
    setFilters(emptyFilters);
    setSearchTerm('');
    onFilterChange(emptyFilters);
    onSearchChange('');
  };

  const bookTypes = [
    { value: '', label: 'Todos los tipos' },
    { value: 'ficcion', label: 'Ficción' },
    { value: 'no ficcion', label: 'No Ficción' },
    { value: 'ciencia', label: 'Ciencia' },
    { value: 'historia', label: 'Historia' },
    { value: 'arte', label: 'Arte' },
    { value: 'tecnologia', label: 'Tecnología' },
    { value: 'literatura', label: 'Literatura' }
  ];

  const bookStatuses = [
    { value: '', label: 'Todos los estados' },
    { value: 'disponible', label: 'Disponible' },
    { value: 'prestado', label: 'Prestado' },
    { value: 'reservado', label: 'Reservado' }
  ];

  const genres = [
    { value: '', label: 'Todos los géneros' },
    { value: 'novela', label: 'Novela' },
    { value: 'ensayo', label: 'Ensayo' },
    { value: 'biografia', label: 'Biografía' },
    { value: 'ciencia_ficcion', label: 'Ciencia Ficción' },
    { value: 'fantasia', label: 'Fantasía' },
    { value: 'misterio', label: 'Misterio' },
    { value: 'romance', label: 'Romance' },
    { value: 'terror', label: 'Terror' },
    { value: 'aventura', label: 'Aventura' }
  ];

  const years = [
    { value: '', label: 'Todos los años' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
    { value: '2019', label: '2019' },
    { value: '2018', label: '2018' },
    { value: '2017', label: '2017' },
    { value: '2016', label: '2016' },
    { value: '2015', label: '2015' }
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
            <label>Estado</label>
            <select 
              value={filters.status} 
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              {bookStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Género</label>
            <select 
              value={filters.genre} 
              onChange={(e) => handleFilterChange('genre', e.target.value)}
            >
              {genres.map(genre => (
                <option key={genre.value} value={genre.value}>
                  {genre.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Año</label>
            <select 
              value={filters.year} 
              onChange={(e) => handleFilterChange('year', e.target.value)}
            >
              {years.map(year => (
                <option key={year.value} value={year.value}>
                  {year.label}
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