import React, { useState, useEffect } from 'react';
import fineService from '../../services/fineService';
import FineCard from '../fines/FineCard';
import LoadingSpinner from '../common/LoadingSpinner';
import '../styles/MyFinesPage.css'; 

const MyFinesPage = () => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, paid, unpaid

  useEffect(() => {
    fetchMyFines();
  }, []);

  const fetchMyFines = async () => {
    try {
      setLoading(true);
      const data = await fineService.getMyFines();
      setFines(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayFine = async (fineId) => {
    try {
      await fineService.payFine(fineId);
      await fetchMyFines(); // Refrescar la lista
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredFines = fines.filter(fine => {
    if (filter === 'paid') return fine.paid;
    if (filter === 'unpaid') return !fine.paid;
    return true;
  });

  const totalUnpaidAmount = fines
    .filter(fine => !fine.paid)
    .reduce((sum, fine) => sum + fine.amount, 0);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="my-fines-page">
      <div className="container">
        <div className="page-header">
          <h1>Mis Multas</h1>
          <div className="fines-summary">
            <div className="summary-item">
              <span className="label">Total de multas:</span>
              <span className="value">{fines.length}</span>
            </div>
            <div className="summary-item">
              <span className="label">Multas pendientes:</span>
              <span className="value unpaid">{fines.filter(f => !f.paid).length}</span>
            </div>
            <div className="summary-item">
              <span className="label">Monto total adeudado:</span>
              <span className="value amount">${totalUnpaidAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
            <button onClick={fetchMyFines} className="retry-btn">
              Reintentar
            </button>
          </div>
        )}

        <div className="filters">
          <h3>Filtrar por estado:</h3>
          <div className="filter-buttons">
            <button 
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              Todas ({fines.length})
            </button>
            <button 
              className={filter === 'unpaid' ? 'active' : ''}
              onClick={() => setFilter('unpaid')}
            >
              Pendientes ({fines.filter(f => !f.paid).length})
            </button>
            <button 
              className={filter === 'paid' ? 'active' : ''}
              onClick={() => setFilter('paid')}
            >
              Pagadas ({fines.filter(f => f.paid).length})
            </button>
          </div>
        </div>

        <div className="fines-grid">
          {filteredFines.length === 0 ? (
            <div className="no-fines">
              <div className="no-fines-icon">💰</div>
              <h3>
                {filter === 'all' ? 'No tienes multas' : 
                 filter === 'paid' ? 'No tienes multas pagadas' : 
                 'No tienes multas pendientes'}
              </h3>
              <p>
                {filter === 'all' ? '¡Excelente! Mantén tus préstamos al día.' : 
                 filter === 'paid' ? 'Aún no has pagado ninguna multa.' : 
                 '¡Genial! No tienes multas pendientes de pago.'}
              </p>
            </div>
          ) : (
            filteredFines.map(fine => (
              <FineCard
                key={fine.id}
                fine={fine}
                onPayFine={handlePayFine}
                showPayButton={!fine.paid}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyFinesPage;