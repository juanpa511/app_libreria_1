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

  const getStatusClass = (state) => {
    return state ? 'status-paid' : 'status-pending';
  };

  const getStatusText = (state) => {
    return state ? 'Pagada' : 'Pendiente';
  };

  // Como el backend no tiene fecha de vencimiento, usamos la fecha actual
  const isOverdue = false;
  const isDueSoon = false;

  return (
    <div className={`fine-card ${getStatusClass(fine.status)}`}>
      <div className="fine-card-header">
        <div className="fine-id">
          <span className="label">Multa #:</span>
          <span className="value">{fine.idFine}</span>
        </div>
        <div className={`fine-status ${getStatusClass(fine.state)}`}>
          {getStatusText(fine.state)}
        </div>
      </div>

      <div className="fine-card-content">
        <div className="fine-amount">
          <span className="amount-label">Monto:</span>
          <span className="amount-value">{formatCurrency(fine.amount)}</span>
        </div>

        <div className="fine-info">
          <div className="fine-reason">
            <span className="label">Descripción:</span>
            <p className="reason-text">{fine.description || 'Sin especificar'}</p>
          </div>

          {isAdmin && (
            <div className="reader-info">
              <p className="reader-name">
                <span className="label">Lector:</span> {fine.user?.name || 'N/A'}
              </p>
              <p className="reader-email">
                <span className="label">Email:</span> {fine.user?.email || 'N/A'}
              </p>
            </div>
          )}
        </div>

        <div className="fine-dates">
          <div className="creation-date">
            <span className="label">Estado:</span>
            <span className="value">{fine.state ? 'Pagada' : 'Pendiente'}</span>
          </div>
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

        {!fine.state && (
          <>
            <button 
              className="btn btn-success"
              onClick={() => onPayFine && onPayFine(fine.idFine)}
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
                  onClick={() => onDeleteFine && onDeleteFine(fine.idFine)}
                >
                  Eliminar
                </button>
              </>
            )}
          </>
        )}
      </div>


    </div>
  );
};

export default FineCard;