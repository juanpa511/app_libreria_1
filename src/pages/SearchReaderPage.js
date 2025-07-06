import React, { useState, useEffect } from 'react';
import readerService from '../services/readerService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import '../styles/SearchReaderPage.css'; 

const SearchReaderPage = () => {
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReader, setSelectedReader] = useState(null);

  useEffect(() => {
    if (searchTerm.trim().length > 2) {
      searchReaders();
    } else {
      setReaders([]);
    }
  }, [searchTerm]);

  const searchReaders = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await readerService.searchReaders(searchTerm);
      setReaders(response.data);
    } catch (err) {
      setError('Error al buscar lectores');
      console.error('Error searching readers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReaderSelect = async (readerId) => {
    try {
      setError('');
      const response = await readerService.getReaderDetails(readerId);
      setSelectedReader(response.data);
    } catch (err) {
      setError('Error al obtener detalles del lector');
      console.error('Error getting reader details:', err);
    }
  };

  return (
    <div className="search-reader-page">
      <div className="search-header">
        <h1>Buscar Lector</h1>
        <p>Encuentra y consulta información de lectores</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="search-section">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Buscar por nombre, email o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {loading && <div className="search-loading">Buscando...</div>}
        </div>
      </div>

      <div className="search-results">
        {readers.length > 0 && (
          <div className="readers-list">
            <h3>Resultados de búsqueda ({readers.length})</h3>
            <div className="readers-grid">
              {readers.map((reader) => (
                <div key={reader.id} className="reader-card">
                  <div className="reader-info">
                    <h4>{reader.name}</h4>
                    <p><strong>Email:</strong> {reader.email}</p>
                    <p><strong>ID:</strong> {reader.id}</p>
                    <p><strong>Teléfono:</strong> {reader.phone || 'N/A'}</p>
                  </div>
                  <div className="reader-actions">
                    <button
                      onClick={() => handleReaderSelect(reader.id)}
                      className="details-button"
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedReader && (
        <div className="reader-details">
          <h3>Detalles del Lector</h3>
          <div className="details-card">
            <div className="details-header">
              <h4>{selectedReader.name}</h4>
              <span className={`status ${selectedReader.isActive ? 'active' : 'inactive'}`}>
                {selectedReader.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            
            <div className="details-content">
              <div className="details-section">
                <h5>Información Personal</h5>
                <p><strong>Email:</strong> {selectedReader.email}</p>
                <p><strong>Teléfono:</strong> {selectedReader.phone || 'N/A'}</p>
                <p><strong>Dirección:</strong> {selectedReader.address || 'N/A'}</p>
                <p><strong>Fecha de registro:</strong> {new Date(selectedReader.registrationDate).toLocaleDateString()}</p>
              </div>

              <div className="details-section">
                <h5>Estadísticas</h5>
                <p><strong>Préstamos activos:</strong> {selectedReader.activeLoans || 0}</p>
                <p><strong>Total de préstamos:</strong> {selectedReader.totalLoans || 0}</p>
                <p><strong>Multas pendientes:</strong> {selectedReader.pendingFines || 0}</p>
                <p><strong>Total pagado en multas:</strong> ${selectedReader.totalFinesPaid || 0}</p>
              </div>

              {selectedReader.currentLoans && selectedReader.currentLoans.length > 0 && (
                <div className="details-section">
                  <h5>Préstamos Actuales</h5>
                  <div className="current-loans">
                    {selectedReader.currentLoans.map((loan) => (
                      <div key={loan.id} className="loan-item">
                        <p><strong>{loan.book?.title}</strong></p>
                        <p>Vence: {new Date(loan.returnDate).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="details-actions">
              <button
                onClick={() => setSelectedReader(null)}
                className="close-button"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchReaderPage;