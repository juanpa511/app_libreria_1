import React from 'react';

const LoanCard = ({ 
  loan, 
  onReturnLoan, 
  onExtendLoan, 
  onViewDetails,
  isAdmin = false 
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'ACTIVE': return 'status-active';
      case 'RETURNED': return 'status-returned';
      case 'OVERDUE': return 'status-overdue';
      default: return 'status-default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ACTIVE': return 'Activo';
      case 'RETURNED': return 'Devuelto';
      case 'OVERDUE': return 'Vencido';
      default: return status;
    }
  };

  const daysUntilDue = getDaysUntilDue(loan.dueDate);
  const isOverdue = daysUntilDue < 0;
  const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;

  return (
    <div className={`loan-card ${getStatusClass(loan.status)}`}>
      <div className="loan-card-header">
        <div className="loan-id">
          <span className="label">ID:</span>
          <span className="value">#{loan.id}</span>
        </div>
        <div className={`loan-status ${getStatusClass(loan.status)}`}>
          {getStatusText(loan.status)}
        </div>
      </div>

      <div className="loan-card-content">
        <div className="book-info">
          <h3 className="book-title">{loan.bookTitle || 'Título no disponible'}</h3>
          <p className="book-author">
            <span className="label">Autor:</span> {loan.bookAuthor || 'N/A'}
          </p>
          <p className="book-isbn">
            <span className="label">ISBN:</span> {loan.bookIsbn || 'N/A'}
          </p>
        </div>

        {isAdmin && (
          <div className="reader-info">
            <p className="reader-name">
              <span className="label">Lector:</span> {loan.readerName || 'N/A'}
            </p>
            <p className="reader-email">
              <span className="label">Email:</span> {loan.readerEmail || 'N/A'}
            </p>
          </div>
        )}

        <div className="loan-dates">
          <div className="loan-date">
            <span className="label">Fecha Préstamo:</span>
            <span className="value">{formatDate(loan.loanDate)}</span>
          </div>
          <div className="due-date">
            <span className="label">Fecha Vencimiento:</span>
            <span className={`value ${isOverdue ? 'overdue' : isDueSoon ? 'due-soon' : ''}`}>
              {formatDate(loan.dueDate)}
            </span>
          </div>
          {loan.returnDate && (
            <div className="return-date">
              <span className="label">Fecha Devolución:</span>
              <span className="value">{formatDate(loan.returnDate)}</span>
            </div>
          )}
        </div>

        {loan.status === 'ACTIVE' && (
          <div className="loan-alert">
            {isOverdue && (
              <div className="alert alert-danger">
                <strong>¡Vencido!</strong> {Math.abs(daysUntilDue)} días de retraso
              </div>
            )}
            {isDueSoon && !isOverdue && (
              <div className="alert alert-warning">
                <strong>¡Próximo a vencer!</strong> {daysUntilDue} días restantes
              </div>
            )}
          </div>
        )}
      </div>

      <div className="loan-card-actions">
        <button 
          className="btn btn-info"
          onClick={() => onViewDetails && onViewDetails(loan)}
        >
          Ver Detalles
        </button>

        {loan.status === 'ACTIVE' && (
          <>
            <button 
              className="btn btn-success"
              onClick={() => onReturnLoan && onReturnLoan(loan.id)}
            >
              Devolver
            </button>
            
            {!isOverdue && (
              <button 
                className="btn btn-warning"
                onClick={() => onExtendLoan && onExtendLoan(loan.id)}
              >
                Extender
              </button>
            )}
          </>
        )}
      </div>

      {loan.notes && (
        <div className="loan-notes">
          <span className="label">Notas:</span>
          <p>{loan.notes}</p>
        </div>
      )}
    </div>
  );
};

export default LoanCard;