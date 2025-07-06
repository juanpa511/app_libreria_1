import React from 'react';
import LoanCard from './LoanCard';
import LoadingSpinner from '../common/LoadingSpinner';

const LoanList = ({ loans, loading, onReturn }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!loans || loans.length === 0) {
    return (
      <div className="empty-state">
        <h3>No hay préstamos registrados</h3>
        <p>Cuando tengas libros prestados, aparecerán aquí.</p>
      </div>
    );
  }

  return (
    <div className="loan-list">
      {loans.map(loan => (
        <LoanCard 
          key={loan.id} 
          loan={loan} 
          onReturn={onReturn}
        />
      ))}
    </div>
  );
};

export default LoanList;