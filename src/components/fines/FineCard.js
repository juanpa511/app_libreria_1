import React from 'react';

const FineCard = ({ 
  fine, 
  onPayFine, 
  onViewDetails, 
  onEditFine, 
  onCancelFine,
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

  const formatCurrency = (amount) => {
    if (!amount) return '$0';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'PAID': return 'status-paid';
      case 'CANCELLED': return 'status-cancelled';
      case 'OVERDUE': return 'status-overdue';
      default: return 'status-default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Pendiente';
      case 'PAID': return 'Pagada';
      case 'CANCELLED': return 'Cancelada';
      case 'OVERDUE': return 'Vencida';
      default: return status;
    }
  };

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue(fine.dueDate);
  const isOverdue = daysUntilDue < 0;
  const isDueSoon = daysUntilDue <= 7 && daysUntilDue >= 0;

  return (
    <div className={`fine-card ${getStatusClass(fine.status)}`}>
      <div className="fine-card-header">
        <div className="fine-id">
          <span className="label">Multa #:</span>
          <span className="value">{fine.id}</span>
        </div>
        <div className={`fine-status ${getStatusClass(fine.status)}`}>
          {getStatusText(fine.status)}
        </div>
      </div>

      <div className="fine-card-content">
        <div className="fine-amount">
          <span className="amount-label">Monto:</span>
          <span className="amount-value">{formatCurrency(fine.amount)}</span>
        </div>

        <div className="fine-info">
          <div className="fine-reason">
            <span className="label">Razón:</span>
            <p className="reason-text">{fine.reason || 'Sin especificar'}</p>
          </div>

          {isAdmin && (
            <div className="reader-info">
              <p className="reader-name">
                <span className="label">Lector:</span> {fine.readerName || 'N/A'}
              </p>
              <p className="reader-email">
                <span className="label">Email:</span> {fine.readerEmail || 'N/A'}
              </p>
            </div>
          )}

          <div className="loan-info">
            <p className="loan-id">
              <span className="label">Préstamo:</span> #{fine.loanId}
            </p>
            {fine.bookTitle && (
              <p className="book-title">
                <span className="label">Libro:</span> {fine.bookTitle}
              </p>
            )}
          </div>
        </div>

        <div className="fine-dates">
          <div className="creation-date">
            <span className="label">Fecha Creación:</span>
            <span className="value">{formatDate(fine.createdDate)}</span>
          </div>
          <div className="due-date">
            <span className="label">Fecha Vencimiento:</span>
            <span className={`value ${isOverdue ? 'overdue' : isDueSoon ? 'due-soon' : ''}`}>
              {formatDate(fine.dueDate)}
            </span>
          </div>
          {fine.paidDate && (
            <div className="paid-date">
              <span className="label">Fecha Pago:</span>
              <span className="value">{formatDate(fine.paidDate)}</span>
            </div>
          )}
        </div>

        {fine.status === 'PENDING' && (
          <div className="fine-alert">
            {isOverdue && (
              <div className="alert alert-danger">
                <strong>¡Multa vencida!</strong> {Math.abs(daysUntilDue)} días de retraso
              </div>
            )}
            {isDueSoon && !isOverdue && (
              <div className="alert alert-warning">
                <strong>¡Próxima a vencer!</strong> {daysUntilDue} días restantes
              </div>
            )}
          </div>
        )}
      </div>

      <div className="fine-card-actions">
        <button 
          className="btn btn-info"
          onClick={() => onViewDetails && onViewDetails(fine)}
        >
          Ver Detalles
        </button>

        {fine.status === 'PENDING' && (
          <>
            <button 
              className="btn btn-success"
              onClick={() => onPayFine && onPayFine(fine.id)}
            >
              Pagar Multa
            </button>
            
            {isAdmin && (
              <>
                <button 
                  className="btn btn-warning"
                  onClick={() => onEditFine && onEditFine(fine)}
                >
                  Editar
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => onCancelFine && onCancelFine(fine.id)}
                >
                  Cancelar
                </button>
              </>
            )}
          </>
        )}
      </div>

      {fine.notes && (
        <div className="fine-notes">
          <span className="label">Notas:</span>
          <p>{fine.notes}</p>
        </div>
      )}

      {fine.paymentMethod && fine.status === 'PAID' && (
        <div className="payment-info">
          <span className="label">Método de Pago:</span>
          <span className="value">{fine.paymentMethod}</span>
        </div>
      )}
    </div>
  );
};

export default FineCard;