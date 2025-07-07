import React from 'react';
import '../styles/ReaderCard.css'; 

const ReaderCard = ({ reader, onSelectReader, showSelectButton = false }) => {
  if (!reader) return null;

  return (
    <div className="reader-card">
      <div className="reader-card-header">
        <h3 className="reader-name">{reader.name}</h3>
        <span className="reader-id">ID: {reader.id}</span>
      </div>
      
      <div className="reader-card-body">
        <div className="reader-info">
          <div className="info-item">
            <span className="label">Email:</span>
            <span className="value">{reader.email}</span>
          </div>
          
          <div className="info-item">
            <span className="label">Teléfono:</span>
            <span className="value">{reader.phone || 'No especificado'}</span>
          </div>
          
          <div className="info-item">
            <span className="label">Estado:</span>
            <span className={`status ${reader.isActive ? 'active' : 'inactive'}`}>
              {reader.isActive ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          
          <div className="info-item">
            <span className="label">Préstamos activos:</span>
            <span className="value">{reader.activeLoans || 0}</span>
          </div>
          
          <div className="info-item">
            <span className="label">Multas pendientes:</span>
            <span className="value">{reader.pendingFines || 0}</span>
          </div>
        </div>
        
        {showSelectButton && (
          <div className="reader-card-actions">
            <button 
              className="btn btn-primary"
              onClick={() => onSelectReader(reader)}
            >
              Seleccionar Lector
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReaderCard;