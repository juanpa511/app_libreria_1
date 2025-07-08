import { 
  getAllFines as fetchAllFines, 
  getFinesByEmail as fetchFinesByEmail,
  createFine as apiCreateFine,
  updateFine as apiUpdateFine,
  payFine as apiPayFine,
  deleteFine as apiDeleteFine,
  getUserEmail
} from './apiService';

const fineService = {
  // Obtener multas del usuario actual
  getMyFines: async () => {
    try {
      const userEmail = getUserEmail();
      if (!userEmail) {
        throw new Error('Usuario no autenticado');
      }
      const url = `http://localhost:8087/api/finde/find/${userEmail}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al obtener multas');
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Error al obtener mis multas: ' + error.message);
    }
  },

  // Obtener todas las multas (Admin)
  getAllFines: async (filters = {}) => {
    try {
      const response = await fetchAllFines();
      return response;
    } catch (error) {
      throw new Error('Error al obtener multas: ' + error.message);
    }
  },

  // Obtener multas por email (Admin)
  getFinesByUser: async (email) => {
    try {
      const response = await fetchFinesByEmail(email);
      return response;
    } catch (error) {
      throw new Error('Error al obtener multas del usuario: ' + error.message);
    }
  },

  // Pagar multa
  payFine: async (fineId) => {
    try {
      const response = await apiPayFine(fineId);
      return response;
    } catch (error) {
      throw new Error('Error al pagar multa: ' + error.message);
    }
  },

  // Crear multa (Admin)
  createFine: async (fineData) => {
    try {
      const response = await apiCreateFine(fineData);
      return response;
    } catch (error) {
      throw new Error('Error al crear multa: ' + error.message);
    }
  },

  // Actualizar multa (Admin)
  updateFine: async (id, fineData) => {
    try {
      const response = await apiUpdateFine(id, fineData);
      return response;
    } catch (error) {
      throw new Error('Error al actualizar multa: ' + error.message);
    }
  },

  // Eliminar multa (Admin)
  deleteFine: async (id) => {
    try {
      const response = await apiDeleteFine(id);
      return response;
    } catch (error) {
      throw new Error('Error al eliminar multa: ' + error.message);
    }
  }
};

export default fineService;