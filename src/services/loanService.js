import api from './api';

const loanService = {
  // Obtener préstamos del usuario actual
  getMyLoans: async () => {
    try {
      const response = await api.get('/loans/my-loans');
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener mis préstamos: ' + error.message);
    }
  },

  // Obtener todos los préstamos (Admin)
  getAllLoans: async () => {
    try {
      const response = await api.get('/loans');
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener préstamos: ' + error.message);
    }
  },

  // Crear nuevo préstamo (Admin)
  createLoan: async (loanData) => {
    try {
      const response = await api.post('/loans', loanData);
      return response.data;
    } catch (error) {
      throw new Error('Error al crear préstamo: ' + error.message);
    }
  },

  // Devolver libro
  returnBook: async (loanId) => {
    try {
      const response = await api.put(`/loans/${loanId}/return`);
      return response.data;
    } catch (error) {
      throw new Error('Error al devolver libro: ' + error.message);
    }
  },

  // Renovar préstamo
  renewLoan: async (loanId) => {
    try {
      const response = await api.put(`/loans/${loanId}/renew`);
      return response.data;
    } catch (error) {
      throw new Error('Error al renovar préstamo: ' + error.message);
    }
  },

  // Obtener préstamos por usuario (Admin)
  getLoansByUser: async (userId) => {
    try {
      const response = await api.get(`/loans/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener préstamos del usuario: ' + error.message);
    }
  },

  // Obtener préstamos vencidos
  getOverdueLoans: async () => {
    try {
      const response = await api.get('/loans/overdue');
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener préstamos vencidos: ' + error.message);
    }
  }
};

export default loanService;