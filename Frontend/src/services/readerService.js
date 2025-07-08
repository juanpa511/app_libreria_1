import api from './apiService';

const readerService = {
  // Obtener todos los lectores (Admin)
  getAllReaders: async () => {
    try {
      const response = await api.get('/reader/all');
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener lectores: ' + error.message);
    }
  },

  // Obtener lector por ID
  getReaderById: async (id) => {
    try {
      const response = await api.get(`/reader/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener lector: ' + error.message);
    }
  },

  // Obtener detalles completos del lector
  getReaderDetails: async (id) => {
    try {
      const response = await api.get(`/reader/${id}/details`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener detalles del lector: ' + error.message);
    }
  },

  // Buscar lectores
  searchReaders: async (query) => {
    try {
      const response = await api.get(`/reader/search?q=${query}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al buscar lectores: ' + error.message);
    }
  },

  // Buscar lector por email
  searchReaderByEmail: async (email) => {
    try {
      const response = await api.get(`/reader/find/${email}`);
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
      const response = await api.put(`/reader/${id}`, readerData);
      return response.data;
    } catch (error) {
      throw new Error('Error al actualizar lector: ' + error.message);
    }
  },

  // Eliminar lector (Admin)
  deleteReader: async (id) => {
    try {
      const response = await api.delete(`/reader/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al eliminar lector: ' + error.message);
    }
  },

  // Activar/desactivar lector (Admin)
  toggleReaderStatus: async (id) => {
    try {
      const response = await api.put(`/reader/state/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al cambiar estado del lector: ' + error.message);
    }
  }
};

export default readerService;