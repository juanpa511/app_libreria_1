import { getAllBooks as getAllBooksApi, getBooksByType as getBooksByTypeApi, createBook as createBookApi, findBookByTitle as findBookByTitleApi } from './apiService';

const bookService = {
  // Obtener todos los libros
  getAllBooks: async () => {
    try {
      const response = await getAllBooksApi();
      // Si la respuesta es un array directamente, devuélvela así
      if (Array.isArray(response)) {
        return { data: response };
      }
      // Si la respuesta es un objeto con una propiedad 'data', úsala
      if (response && Array.isArray(response.data)) {
        return response;
      }
      // Si la respuesta es un objeto con los libros en otra propiedad, ajústalo aquí
      return { data: [] };
    } catch (error) {
      throw new Error('Error al obtener libros: ' + error.message);
    }
  },

  // Obtener libros por tipo
  getBooksByType: async (type) => {
    try {
      const response = await getBooksByTypeApi(type);
      return response;
    } catch (error) {
      throw new Error('Error al obtener libros por tipo: ' + error.message);
    }
  },

  // Crear nuevo libro (Admin)
  createBook: async (bookData) => {
    try {
      const response = await createBookApi(bookData);
      return response;
    } catch (error) {
      throw new Error('Error al crear libro: ' + error.message);
    }
  },

  // Buscar libros por título
  searchBooks: async (query) => {
    try {
      const response = await findBookByTitleApi(query);
      return response;
    } catch (error) {
      throw new Error('Error al buscar libros: ' + error.message);
    }
  }
};

export default bookService;