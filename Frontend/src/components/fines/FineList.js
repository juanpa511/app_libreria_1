import React from 'react';
import FineCard from './FineCard';
import LoadingSpinner from '../common/LoadingSpinner';

const FineList = ({ fines, loading, onPayFine }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!fines || fines.length === 0) {
    return (
      <div className="empty-state">
        <h3>No tienes multas registradas</h3>
        <p>¡Felicidades! No tienes multas pendientes.</p>
      </div>
    );
  }

  const pendingFines = fines.filter(fine => !fine.paid);
  const paidFines = fines.filter(fine => fine.paid);

  return (
    <div className="fine-list">
      {pendingFines.length > 0 && (
        <div className="fines-section">
          <h3>Multas Pendientes ({pendingFines.length})</h3>
          <div className="fines-grid">
            {pendingFines.map(fine => (
              <FineCard 
                key={fine.id} 
                fine={fine} 
                onPayFine={onPayFine}
              />
            ))}
          </div>
        </div>
      )}

      {paidFines.length > 0 && (
        <div className="fines-section">
          <h3>Multas Pagadas ({paidFines.length})</h3>
          <div className="fines-grid">
            {paidFines.map(fine => (
              <FineCard 
                key={fine.id} 
                fine={fine} 
                onPayFine={onPayFine}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FineList;