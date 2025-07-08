import api from './apiService';

const bookService = {
  // Obtener todos los libros
  getAllBooks: async () => {
    try {
      const response = await api.get('/books');
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener libros: ' + error.message);
    }
  },

  // Obtener libros por tipo
  getBooksByType: async (type) => {
    try {
      const response = await api.get(`/books/type/${type}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener libros por tipo: ' + error.message);
    }
  },

  // Obtener libro por ID
  getBookById: async (id) => {
    try {
      const response = await api.get(`/books/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener libro: ' + error.message);
    }
  },

  // Crear nuevo libro (Admin)
  createBook: async (bookData) => {
    try {
      const response = await api.post('/books', bookData);
      return response.data;
    } catch (error) {
      throw new Error('Error al crear libro: ' + error.message);
    }
  },

  // Actualizar libro (Admin)
  updateBook: async (id, bookData) => {
    try {
      const response = await api.put(`/books/${id}`, bookData);
      return response.data;
    } catch (error) {
      throw new Error('Error al actualizar libro: ' + error.message);
    }
  },

  // Eliminar libro (Admin)
  deleteBook: async (id) => {
    try {
      const response = await api.delete(`/books/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al eliminar libro: ' + error.message);
    }
  },

  // Buscar libros
  searchBooks: async (query) => {
    try {
      const response = await api.get(`/books/search?q=${query}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al buscar libros: ' + error.message);
    }
  }
};

export default bookService;