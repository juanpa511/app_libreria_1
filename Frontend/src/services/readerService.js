import api from './apiService';

const readerService = {
  // Obtener todos los lectores (Admin)
  getAllReaders: async () => {
    try {
      const response = await api.get('/readers');
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener lectores: ' + error.message);
    }
  },

  // Obtener lector por ID
  getReaderById: async (id) => {
    try {
      const response = await api.get(`/readers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener lector: ' + error.message);
    }
  },

  // Buscar lectores
  searchReaders: async (query) => {
    try {
      const response = await api.get(`/readers/search?q=${query}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al buscar lectores: ' + error.message);
    }
  },

  // Buscar lector por email
  searchReaderByEmail: async (email) => {
    try {
      const response = await api.get(`/readers/email/${email}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al buscar lector por email: ' + error.message);
    }
  },

  // Buscar lector por RUT
  searchReaderByRut: async (rut) => {
    try {
      const response = await api.get(`/readers/rut/${rut}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al buscar lector por RUT: ' + error.message);
    }
  },

  // Actualizar lector
  updateReader: async (id, readerData) => {
    try {
      const response = await api.put(`/readers/${id}`, readerData);
      return response.data;
    } catch (error) {
      throw new Error('Error al actualizar lector: ' + error.message);
    }
  },

  // Eliminar lector (Admin)
  deleteReader: async (id) => {
    try {
      const response = await api.delete(`/readers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al eliminar lector: ' + error.message);
    }
  },

  // Activar/desactivar lector (Admin)
  toggleReaderStatus: async (id) => {
    try {
      const response = await api.put(`/readers/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      throw new Error('Error al cambiar estado del lector: ' + error.message);
    }
  }
};

export default readerService;