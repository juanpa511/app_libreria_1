import React, { useState, useEffect } from 'react';
import readerService from '../../services/readerService';
import LoadingSpinner from '../common/LoadingSpinner';
import '../styles/ReaderSearch.css'; 

const ReaderSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [readers, setReaders] = useState([]);
  const [filteredReaders, setFilteredReaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReader, setSelectedReader] = useState(null);

  useEffect(() => {
    loadReaders();
  }, []);

  useEffect(() => {
    filterReaders();
  }, [searchTerm, readers]);

  const loadReaders = async () => {
    setLoading(true);
    try {
      const data = await readerService.getAllReaders();
      setReaders(data);
      setFilteredReaders(data);
    } catch (error) {
      console.error('Error al cargar lectores:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterReaders = () => {
    if (!searchTerm) {
      setFilteredReaders(readers);
      return;
    }

    const filtered = readers.filter(reader => 
      reader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reader.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reader.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReaders(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleReaderSelect = (reader) => {
    setSelectedReader(reader);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="reader-search-container">
      <h2>Buscar Lectores</h2>
      
      <div className="search-section">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="search-results-count">
          {filteredReaders.length} lector{filteredReaders.length !== 1 ? 'es' : ''} encontrado{filteredReaders.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="readers-section">
        <div className="readers-list">
          {filteredReaders.length === 0 ? (
            <div className="no-results">
              <p>No se encontraron lectores que coincidan con la búsqueda.</p>
            </div>
          ) : (
            filteredReaders.map(reader => (
              <div 
                key={reader.id} 
                className={`reader-card ${selectedReader?.id === reader.id ? 'selected' : ''}`}
                onClick={() => handleReaderSelect(reader)}
              >
                <div className="reader-info">
                  <h3>{reader.name}</h3>
                  <p><strong>Email:</strong> {reader.email}</p>
                  <p><strong>Teléfono:</strong> {reader.phone}</p>
                  <p><strong>Fecha de registro:</strong> {formatDate(reader.registrationDate)}</p>
                </div>
                <div className="reader-status">
                  <span className={`status-badge ${reader.active ? 'active' : 'inactive'}`}>
                    {reader.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedReader && (
          <div className="reader-details">
            <h3>Detalles del Lector</h3>
            <div className="details-content">
              <div className="detail-item">
                <strong>Nombre:</strong> {selectedReader.name}
              </div>
              <div className="detail-item">
                <strong>Email:</strong> {selectedReader.email}
              </div>
              <div className="detail-item">
                <strong>Teléfono:</strong> {selectedReader.phone}
              </div>
              <div className="detail-item">
                <strong>Dirección:</strong> {selectedReader.address || 'No especificada'}
              </div>
              <div className="detail-item">
                <strong>Fecha de registro:</strong> {formatDate(selectedReader.registrationDate)}
              </div>
              <div className="detail-item">
                <strong>Estado:</strong> 
                <span className={`status-badge ${selectedReader.active ? 'active' : 'inactive'}`}>
                  {selectedReader.active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="detail-item">
                <strong>Préstamos activos:</strong> {selectedReader.activeLoans || 0}
              </div>
              <div className="detail-item">
                <strong>Total de préstamos:</strong> {selectedReader.totalLoans || 0}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReaderSearch;