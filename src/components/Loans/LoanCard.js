import React from 'react';
import '../styles/LoanCard.css'; 

const LoanCard = ({ loan, onReturn }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className={`loan-card ${isOverdue(loan.dueDate) ? 'overdue' : ''}`}>
      <div className="loan-card-header">
        <h3>{loan.bookTitle}</h3>
        <span className="loan-status">
          {isOverdue(loan.dueDate) ? 'Vencido' : 'Activo'}
        </span>
      </div>
      
      <div className="loan-card-body">
        <div className="loan-info">
          <p><strong>Autor:</strong> {loan.bookAuthor}</p>
          <p><strong>Fecha de préstamo:</strong> {formatDate(loan.loanDate)}</p>
          <p><strong>Fecha de vencimiento:</strong> {formatDate(loan.dueDate)}</p>
          <p><strong>ISBN:</strong> {loan.bookIsbn}</p>
        </div>
        
        <div className="loan-actions">
          <button 
            className="btn-return"
            onClick={() => onReturn(loan.id)}
          >
            Devolver
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanCard;