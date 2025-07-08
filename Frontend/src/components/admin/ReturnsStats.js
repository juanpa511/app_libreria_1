import React from 'react';
import './ReturnsStats.css';

const ReturnsStats = ({ loans }) => {
  // Calcular estadísticas
  const stats = {
    total: loans.length,
    active: loans.filter(loan => loan.status === 'ACTIVE').length,
    returned: loans.filter(loan => loan.status === 'RETURNED').length,
    overdue: loans.filter(loan => loan.status === 'OVERDUE').length,
    totalOverdueDays: loans
      .filter(loan => loan.status === 'OVERDUE')
      .reduce((total, loan) => {
        const now = new Date();
        const due = new Date(loan.dueDate);
        const diffTime = now - due;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return total + (diffDays > 0 ? diffDays : 0);
      }, 0),
    averageLoanDuration: loans
      .filter(loan => loan.status === 'RETURNED')
      .reduce((total, loan) => {
        const loanDate = new Date(loan.loanDate);
        const returnDate = new Date(loan.returnDate);
        const diffTime = returnDate - loanDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return total + diffDays;
      }, 0) / Math.max(loans.filter(loan => loan.status === 'RETURNED').length, 1)
  };

  // Calcular porcentajes
  const percentages = {
    active: stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0,
    returned: stats.total > 0 ? ((stats.returned / stats.total) * 100).toFixed(1) : 0,
    overdue: stats.total > 0 ? ((stats.overdue / stats.total) * 100).toFixed(1) : 0
  };

  // Obtener los libros más prestados
  const bookStats = loans.reduce((acc, loan) => {
    const bookTitle = loan.bookTitle;
    if (!acc[bookTitle]) {
      acc[bookTitle] = { count: 0, returned: 0, overdue: 0 };
    }
    acc[bookTitle].count++;
    if (loan.status === 'RETURNED') acc[bookTitle].returned++;
    if (loan.status === 'OVERDUE') acc[bookTitle].overdue++;
    return acc;
  }, {});

  const topBooks = Object.entries(bookStats)
    .sort(([,a], [,b]) => b.count - a.count)
    .slice(0, 5);

  // Obtener los lectores más activos
  const readerStats = loans.reduce((acc, loan) => {
    const readerEmail = loan.readerEmail;
    if (!acc[readerEmail]) {
      acc[readerEmail] = { 
        name: loan.readerName,
        count: 0, 
        returned: 0, 
        overdue: 0 
      };
    }
    acc[readerEmail].count++;
    if (loan.status === 'RETURNED') acc[readerEmail].returned++;
    if (loan.status === 'OVERDUE') acc[readerEmail].overdue++;
    return acc;
  }, {});

  const topReaders = Object.entries(readerStats)
    .sort(([,a], [,b]) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="returns-stats">
      <h2>📊 Estadísticas Detalladas de Devoluciones</h2>
      
      {/* Estadísticas principales */}
      <div className="stats-overview">
        <div className="stat-item">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Préstamos</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.active}</div>
          <div className="stat-label">Activos ({percentages.active}%)</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.returned}</div>
          <div className="stat-label">Devueltos ({percentages.returned}%)</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.overdue}</div>
          <div className="stat-label">Vencidos ({percentages.overdue}%)</div>
        </div>
      </div>

      {/* Estadísticas adicionales */}
      <div className="stats-details">
        <div className="detail-item">
          <span className="detail-label">Días totales de retraso:</span>
          <span className="detail-value">{stats.totalOverdueDays} días</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Duración promedio de préstamo:</span>
          <span className="detail-value">{stats.averageLoanDuration.toFixed(1)} días</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Tasa de devolución:</span>
          <span className="detail-value">{percentages.returned}%</span>
        </div>
      </div>

      {/* Libros más prestados */}
      <div className="stats-section">
        <h3>📚 Libros Más Prestados</h3>
        <div className="stats-list">
          {topBooks.map(([bookTitle, stats]) => (
            <div key={bookTitle} className="stats-list-item">
              <div className="item-main">
                <span className="item-title">{bookTitle}</span>
                <span className="item-count">{stats.count} préstamos</span>
              </div>
              <div className="item-details">
                <span className="item-returned">Devueltos: {stats.returned}</span>
                <span className="item-overdue">Vencidos: {stats.overdue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lectores más activos */}
      <div className="stats-section">
        <h3>👥 Lectores Más Activos</h3>
        <div className="stats-list">
          {topReaders.map(([email, stats]) => (
            <div key={email} className="stats-list-item">
              <div className="item-main">
                <span className="item-title">{stats.name}</span>
                <span className="item-email">{email}</span>
                <span className="item-count">{stats.count} préstamos</span>
              </div>
              <div className="item-details">
                <span className="item-returned">Devueltos: {stats.returned}</span>
                <span className="item-overdue">Vencidos: {stats.overdue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alertas */}
      <div className="stats-alerts">
        {stats.overdue > 0 && (
          <div className="alert alert-warning">
            ⚠️ Hay {stats.overdue} préstamos vencidos que requieren atención inmediata
          </div>
        )}
        {stats.totalOverdueDays > 30 && (
          <div className="alert alert-danger">
            🚨 Los préstamos vencidos acumulan {stats.totalOverdueDays} días de retraso
          </div>
        )}
        {percentages.returned < 70 && (
          <div className="alert alert-info">
            ℹ️ La tasa de devolución ({percentages.returned}%) está por debajo del 70% recomendado
          </div>
        )}
      </div>
    </div>
  );
};

export default ReturnsStats; 