import React, { useState, useEffect } from 'react';
import loanService from '../services/loanService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import '../styles/ReturnPage.css'; 

const ReturnPage = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchActiveLoans();
  }, []);

  const fetchActiveLoans = async () => {
    try {
      setLoading(true);
      const response = await loanService.getActiveLoans();
      setLoans(response.data);
    } catch (err) {
      setError('Error al cargar los préstamos activos');
      console.error('Error fetching active loans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (loanId) => {
    try {
      setError('');
      setSuccess('');
      
      await loanService.returnLoan(loanId);
      setSuccess('Libro devuelto exitosamente');
      
      // Actualizar la lista de préstamos
      fetchActiveLoans();
    } catch (err) {
      setError('Error al devolver el libro');
      console.error('Error returning book:', err);
    }
  };

  const filteredLoans = loans.filter(loan =>
    loan.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.reader?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="return-page">
      <div className="return-header">
        <h1>Devolución de Libros</h1>
        <p>Gestiona las devoluciones de libros prestados</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="search-section">
        <input
          type="text"
          placeholder="Buscar por título de libro o lector..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="loans-container">
        {filteredLoans.length === 0 ? (
          <div className="no-loans">
            <p>No hay préstamos activos para devolver</p>
          </div>
        ) : (
          <div className="loans-grid">
            {filteredLoans.map((loan) => (
              <div key={loan.id} className="loan-card">
                <div className="loan-info">
                  <h3>{loan.book?.title}</h3>
                  <p><strong>Lector:</strong> {loan.reader?.name}</p>
                  <p><strong>Fecha de préstamo:</strong> {new Date(loan.loanDate).toLocaleDateString()}</p>
                  <p><strong>Fecha de devolución:</strong> {new Date(loan.returnDate).toLocaleDateString()}</p>
                  <p className={`status ${loan.isOverdue ? 'overdue' : 'active'}`}>
                    {loan.isOverdue ? 'Vencido' : 'Activo'}
                  </p>
                </div>
                <div className="loan-actions">
                  <button
                    onClick={() => handleReturn(loan.id)}
                    className="return-button"
                  >
                    Devolver Libro
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReturnPage;