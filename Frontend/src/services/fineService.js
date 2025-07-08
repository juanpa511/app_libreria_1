import api from './apiService';

const fineService = {
  // Obtener multas del usuario actual
  getMyFines: async () => {
    try {
      const response = await api.get('/fines/my-fines');
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener mis multas: ' + error.message);
    }
  },

  // Obtener todas las multas (Admin)
  getAllFines: async () => {
    try {
      const response = await api.get('/fines');
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener multas: ' + error.message);
    }
  },

  // Obtener multas por usuario (Admin)
  getFinesByUser: async (userId) => {
    try {
      const response = await api.get(`/fines/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener multas del usuario: ' + error.message);
    }
  },

  // Pagar multa
  payFine: async (fineId) => {
    try {
      const response = await api.put(`/fines/${fineId}/pay`);
      return response.data;
    } catch (error) {
      throw new Error('Error al pagar multa: ' + error.message);
    }
  },

  // Crear multa (Admin)
  createFine: async (fineData) => {
    try {
      const response = await api.post('/fines', fineData);
      return response.data;
    } catch (error) {
      throw new Error('Error al crear multa: ' + error.message);
    }
  },

  // Actualizar multa (Admin)
  updateFine: async (id, fineData) => {
    try {
      const response = await api.put(`/fines/${id}`, fineData);
      return response.data;
    } catch (error) {
      throw new Error('Error al actualizar multa: ' + error.message);
    }
  },

  // Eliminar multa (Admin)
  deleteFine: async (id) => {
    try {
      const response = await api.delete(`/fines/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al eliminar multa: ' + error.message);
    }
  }
};

export default fineService;