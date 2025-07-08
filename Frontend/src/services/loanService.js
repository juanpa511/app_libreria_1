import apiService from './apiService';

const loanService = {
  // Obtener préstamos del usuario actual
  getMyLoans: async () => {
    try {
      const userEmail = apiService.getUserEmail();
      if (!userEmail) {
        throw new Error('Usuario no autenticado');
      }
      const url = `http://localhost:8087/api/booking/find/${userEmail}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al obtener préstamos');
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Error al obtener mis préstamos: ' + error.message);
    }
  },

  // Obtener todos los préstamos (Admin)
  getAllLoans: async () => {
    try {
      const response = await apiService.getAllLoans();
      return response;
    } catch (error) {
      throw new Error('Error al obtener préstamos: ' + error.message);
    }
  },

  // Crear nuevo préstamo (Admin)
  createLoan: async (loanData) => {
    try {
      const response = await apiService.createBooking(loanData);
      return response;
    } catch (error) {
      throw new Error('Error al crear préstamo: ' + error.message);
    }
  },

  // Devolver libro
  returnLoan: async (bookingId) => {
    try {
      // Para admin, necesitamos obtener el email del usuario del préstamo
      // Primero obtenemos todos los préstamos para encontrar el email del usuario
      const allLoans = await apiService.getAllLoans();
      const loan = allLoans.find(l => l.idBooking === bookingId);
      
      if (!loan || !loan.user || !loan.user.email) {
        throw new Error('No se pudo encontrar el usuario del préstamo');
      }
      
      const returnData = { idBooking: bookingId };
      const response = await apiService.returnBook(loan.user.email, returnData);
      return response;
    } catch (error) {
      throw new Error('Error al devolver libro: ' + error.message);
    }
  },

  // Renovar préstamo
  renewLoan: async (loanId) => {
    try {
      const response = await apiService.renewBooking(loanId);
      return response;
    } catch (error) {
      throw new Error('Error al renovar préstamo: ' + error.message);
    }
  },

  // Cancelar préstamo
  cancelLoan: async (loanId) => {
    try {
      const response = await apiService.cancelBooking(loanId);
      return response;
    } catch (error) {
      throw new Error('Error al cancelar préstamo: ' + error.message);
    }
  },

  // Obtener préstamos por usuario (Admin)
  getLoansByUser: async (userEmail) => {
    try {
      const response = await apiService.getBookingsByEmail(userEmail);
      return response;
    } catch (error) {
      throw new Error('Error al obtener préstamos del usuario: ' + error.message);
    }
  },

  // Obtener préstamos vencidos (filtrar en frontend)
  getOverdueLoans: async () => {
    try {
      const allLoans = await apiService.getAllLoans();
      const now = new Date();
      return allLoans.filter(loan => 
        loan.state && new Date(loan.dateReturn) < now
      );
    } catch (error) {
      throw new Error('Error al obtener préstamos vencidos: ' + error.message);
    }
  }
};

export default loanService;