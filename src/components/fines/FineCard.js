import React from 'react';
import '../styles/FineCard.css'; 
const FineCard = ({ fine, onPayFine, showPayButton = true }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePayClick = () => {
    if (onPayFine) {
      onPayFine(fine.id);
    }
  };

  return (
    <div className={`fine-card ${fine.paid ? 'paid' : 'unpaid'}`}>
      <div className="fine-header">
        <div className="fine-status">
          {fine.paid ? (
            <span className="status-badge paid">✅ Pagada</span>
          ) : (
            <span className="status-badge unpaid">⏰ Pendiente</span>
          )}
        </div>
        <div className="fine-amount">
          ${fine.amount?.toLocaleString() || '0'}
        </div>
      </div>

      <div className="fine-body">
        <div className="fine-info">
          <h4 className="fine-title">{fine.description || 'Multa por retraso'}</h4>
          
          <div className="fine-details">
            <div className="detail-item">
              <span className="label">Libro:</span>
              <span className="value">{fine.bookTitle || 'No especificado'}</span>
            </div>
            
            <div className="detail-item">
              <span className="label">Fecha de multa:</span>
              <span className="value">{formatDate(fine.fineDate)}</span>
            </div>
            
            {fine.dueDate && (
              <div className="detail-item">
                <span className="label">Fecha de vencimiento:</span>
                <span className="value">{formatDate(fine.dueDate)}</span>
              </div>
            )}
            
            {fine.paidDate && (
              <div className="detail-item">
                <span className="label">Fecha de pago:</span>
                <span className="value">{formatDate(fine.paidDate)}</span>
              </div>
            )}
            
            {fine.daysOverdue && (
              <div className="detail-item">
                <span className="label">Días de retraso:</span>
                <span className="value">{fine.daysOverdue} días</span>
              </div>
            )}
          </div>
        </div>

        {showPayButton && !fine.paid && (
          <div className="fine-actions">
            <button 
              onClick={handlePayClick}
              className="pay-btn"
              title="Pagar multa"
            >
              💳 Pagar Multa
            </button>
          </div>
        )}
      </div>

      {fine.notes && (
        <div className="fine-notes">
          <small>
            <strong>Notas:</strong> {fine.notes}
          </small>
        </div>
      )}
    </div>
  );
};

export default FineCard;