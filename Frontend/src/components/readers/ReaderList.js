import React from 'react';
import ReaderCard from './ReaderCard';
import LoadingSpinner from '../common/LoadingSpinner';

const ReaderList = ({ 
  readers, 
  loading, 
  onSelectReader, 
  showSelectButton = false,
  emptyMessage = "No se encontraron lectores" 
}) => {
  if (loading) {
    return (
      <div className="reader-list-loading">
        <LoadingSpinner />
      </div>
    );
  }

  if (!readers || readers.length === 0) {
    return (
      <div className="reader-list-empty">
        <div className="empty-state">
          <h3>📚 {emptyMessage}</h3>
          <p>No hay lectores para mostrar en este momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reader-list">
      <div className="reader-list-header">
        <h3>Lectores encontrados ({readers.length})</h3>
      </div>
      
      <div className="reader-list-content">
        {readers.map((reader) => (
          <ReaderCard
            key={reader.id}
            reader={reader}
            onSelectReader={onSelectReader}
            showSelectButton={showSelectButton}
          />
        ))}
      </div>
    </div>
  );
};

export default ReaderList;