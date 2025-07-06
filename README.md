Library App - Aplicación Web de Biblioteca
Descripción
Library App es una aplicación web moderna desarrollada con React.js que permite la gestión completa de una biblioteca digital. La aplicación incluye funcionalidades para lectores y administradores, con un sistema de autenticación seguro basado en JWT.

Características Principales
Para Lectores
✅ Explorar catálogo de libros con filtros
✅ Visualizar préstamos activos
✅ Consultar multas pendientes
✅ Sistema de autenticación seguro
Para Administradores
✅ Gestión completa de libros (crear, editar, eliminar)
✅ Gestión de préstamos y devoluciones
✅ Administración de multas
✅ Búsqueda de lectores
✅ Panel administrativo completo
Tecnologías Utilizadas
Frontend
React.js - Biblioteca principal para la interfaz
React Router - Navegación y rutas
Axios - Cliente HTTP para comunicación con API
CSS3 - Estilos y diseño responsive
Backend (API REST)
Spring Boot - Framework backend
Spring Security - Autenticación y autorización
JWT - Tokens de autenticación
Estructura del Proyecto
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.js
│   │   └── RegisterForm.js
│   ├── books/
│   │   ├── BookCard.js
│   │   ├── BookFilter.js
│   │   ├── BookForm.js
│   │   └── BookList.js
│   ├── common/
│   │   ├── Footer.js
│   │   ├── Header.js
│   │   ├── LoadingSpinner.js
│   │   └── Navigation.js
│   ├── fines/
│   │   ├── FineCard.js
│   │   ├── FineForm.js
│   │   └── FineList.js
│   ├── loans/
│   │   ├── LoanCard.js
│   │   ├── LoanForm.js
│   │   └── LoanList.js
│   ├── readers/
│   │   ├── ReaderCard.js
│   │   ├── ReaderList.js
│   │   └── ReaderSearch.js
│   └── ProtectedRoute.js
├── context/
│   └── AuthContext.js
├── hooks/
│   ├── useApi.js
│   └── useAuth.js
├── pages/
│   ├── Admin/
│   │   ├── AdminBooksPage.js
│   │   ├── AdminFinesPage.js
│   │   └── AdminLoansPage.js
│   ├── AboutPage.js
│   ├── BooksPage.js
│   ├── CreateBookPage.js
│   ├── HomePage.js
│   ├── LoanPage.js
│   ├── LoginPage.js
│   ├── MyFinesPage.js
│   ├── MyLoansPage.js
│   ├── NavigationPage.js
│   ├── RegisterPage.js
│   ├── ReturnPage.js
│   └── SearchReaderPage.js
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── bookService.js
│   ├── fineService.js
│   ├── loanService.js
│   └── readerService.js
├── styles/
│   ├── components/
│   └── globals.css
├── App.js
└── index.js
Instalación y Configuración
Prerrequisitos
Node.js (versión 14 o superior)
npm o yarn
Backend API ejecutándose (Spring Boot)
Instalación
Clona el repositorio:
bash
git clone [URL_DEL_REPOSITORIO]
cd library-app
Instala las dependencias:
bash
npm install
Crea un archivo .env con la configuración de la API:
env
REACT_APP_API_URL=http://localhost:8080/api
Inicia la aplicación:
bash
npm start
La aplicación estará disponible en http://localhost:3000

Funcionalidades Implementadas
Autenticación
 Registro de usuarios
 Inicio de sesión
 Cerrar sesión
 Protección de rutas
 Gestión de roles (Reader/Admin)
Gestión de Libros
 Listar libros con filtros
 Crear nuevos libros (Admin)
 Editar libros existentes (Admin)
 Eliminar libros (Admin)
Gestión de Préstamos
 Crear préstamos (Admin)
 Listar préstamos por usuario
 Gestionar devoluciones (Admin)
 Historial de préstamos
Gestión de Multas
 Visualizar multas del usuario
 Gestión de multas (Admin)
 Cálculo automático de multas
Administración
 Panel administrativo
 Búsqueda de lectores
 Gestión completa de la biblioteca
Scripts Disponibles
npm start - Inicia la aplicación en modo desarrollo
npm build - Construye la aplicación para producción
npm test - Ejecuta las pruebas
npm run eject - Expone la configuración de Create React App
Evaluación
Este proyecto corresponde a la Evaluación 3 (40%) de la asignatura Electivo III - Programación de Aplicaciones Web de la carrera Ingeniería en Computación e Informática.

Criterios de Evaluación
Construcción de componentes modulares
Visualización de secciones dentro de la aplicación
Carga de datos desde API REST
