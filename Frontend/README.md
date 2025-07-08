# Library App - Sistema de Gestión de Biblioteca

## 📚 Descripción

Library App es una aplicación web moderna desarrollada con React.js que permite la gestión completa de una biblioteca digital. La aplicación incluye funcionalidades avanzadas para lectores y administradores, con un sistema de autenticación seguro basado en JWT y una interfaz de usuario intuitiva.

## ✨ Características Principales

### 👥 Para Lectores
- ✅ Explorar catálogo de libros con filtros avanzados
- ✅ Visualizar préstamos activos y historial
- ✅ Consultar multas pendientes y estado de cuenta
- ✅ Sistema de autenticación seguro con JWT
- ✅ Interfaz responsive y moderna
- ✅ Navegación intuitiva entre secciones

### 🔧 Para Administradores
- ✅ Gestión completa de libros (crear, editar, eliminar)
- ✅ Gestión de préstamos y devoluciones
- ✅ Administración de multas y sanciones
- ✅ Búsqueda avanzada de lectores
- ✅ Panel administrativo completo con estadísticas
- ✅ Gestión de devoluciones con estadísticas en tiempo real
- ✅ Control de inventario de libros

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React.js 18.2.0** - Biblioteca principal para la interfaz de usuario
- **React Router DOM 6.8.0** - Navegación y gestión de rutas
- **Axios 1.3.0** - Cliente HTTP para comunicación con API REST
- **React Bootstrap 2.7.0** - Componentes UI responsivos
- **Bootstrap 5.2.3** - Framework CSS para diseño responsive
- **Styled Components 5.3.6** - Estilos CSS-in-JS
- **SweetAlert2 11.22.2** - Alertas y notificaciones elegantes

### Backend (API REST)
- **Spring Boot** - Framework backend robusto
- **Spring Security** - Autenticación y autorización
- **JWT** - Tokens de autenticación seguros
- **MySQL/PostgreSQL** - Base de datos relacional

## 📁 Estructura del Proyecto

```
Frontend/src/
├── components/
│   ├── admin/
│   │   ├── ReturnsStats.js          # Estadísticas de devoluciones
│   │   └── ReturnsStats.css
│   ├── auth/
│   │   ├── LoginForm.js             # Formulario de inicio de sesión
│   │   └── RegisterForm.js          # Formulario de registro
│   ├── books/
│   │   ├── BookCard.js              # Tarjeta de libro individual
│   │   ├── BookFilter.js            # Filtros de búsqueda
│   │   ├── BookForm.js              # Formulario de libro
│   │   └── BookList.js              # Lista de libros
│   ├── common/
│   │   ├── BackendStatus.js         # Estado del backend
│   │   ├── DebugInfo.js             # Información de depuración
│   │   ├── Footer.js                # Pie de página
│   │   ├── Header.js                # Encabezado
│   │   ├── Layout.js                # Layout principal
│   │   ├── LoadingSpinner.js        # Spinner de carga
│   │   ├── Navigation.js            # Navegación principal
│   │   ├── Notification.js          # Sistema de notificaciones
│   │   └── ProtectedRoute.js        # Rutas protegidas
│   ├── fines/
│   │   ├── FineCard.js              # Tarjeta de multa
│   │   ├── FineForm.js              # Formulario de multa
│   │   └── FineList.js              # Lista de multas
│   ├── Form/
│   │   ├── FineForm.js              # Formulario de multa (alternativo)
│   │   └── ReturnForm.js            # Formulario de devolución
│   ├── Loans/
│   │   ├── CreateLoanModal.js       # Modal para crear préstamo
│   │   ├── LoanCard.js              # Tarjeta de préstamo
│   │   ├── LoanForm.js              # Formulario de préstamo
│   │   └── LoanList.js              # Lista de préstamos
│   └── readers/
│       ├── ReaderCard.js            # Tarjeta de lector
│       ├── ReaderList.js            # Lista de lectores
│       └── ReaderSearch.js          # Búsqueda de lectores
├── context/
│   └── AuthContext.js               # Contexto de autenticación
├── hooks/
│   ├── useApi.js                    # Hook personalizado para API
│   └── useAuth.js                   # Hook de autenticación
├── pages/
│   ├── Admin/
│   │   ├── AdminBooksPage.js        # Página de gestión de libros
│   │   ├── AdminFinesPage.js        # Página de gestión de multas
│   │   ├── AdminLoansPage.js        # Página de gestión de préstamos
│   │   └── AdminReturnsPage.js      # Página de gestión de devoluciones
│   ├── AboutPage.js                 # Página Acerca de
│   ├── BooksPage.js                 # Página de libros (usuario)
│   ├── BooksPublicPage.js           # Página pública de libros
│   ├── CreateBookPage.js            # Página de crear libro
│   ├── HomePage.js                  # Página principal
│   ├── LoanPage.js                  # Página de préstamos
│   ├── LoginPage.js                 # Página de inicio de sesión
│   ├── MyFinesPage.js               # Página de mis multas
│   ├── MyLoansPage.js               # Página de mis préstamos
│   ├── NavigationPage.js            # Página de navegación
│   ├── RegisterPage.js              # Página de registro
│   ├── ReturnPage.js                # Página de devoluciones
│   └── SearchReaderPage.js          # Página de búsqueda de lectores
├── services/
│   ├── apiService.js                # Servicio principal de API
│   ├── authService.js               # Servicio de autenticación
│   ├── bookService.js               # Servicio de libros
│   ├── fineService.js               # Servicio de multas
│   ├── loanService.js               # Servicio de préstamos
│   └── readerService.js             # Servicio de lectores
├── styles/
│   ├── [Archivos CSS específicos para cada componente]
│   ├── globals.css                  # Estilos globales
│   └── variables.css                # Variables CSS
├── utils/
│   ├── constants.js                 # Constantes de la aplicación
│   ├── helpers.js                   # Funciones auxiliares
│   └── validators.js                # Validadores de formularios
├── App.js                           # Componente principal
└── index.js                         # Punto de entrada
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js** (versión 14 o superior)
- **npm** o **yarn**
- **Backend API** ejecutándose (Spring Boot)

### Instalación

1. **Clona el repositorio:**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd app_libreria_1/Frontend
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Crea un archivo `.env` con la configuración de la API:**
   ```env
   REACT_APP_API_URL=http://localhost:8080/api
   ```

4. **Inicia la aplicación:**
   ```bash
   npm start
   ```

La aplicación estará disponible en `http://localhost:3000`

## 🔧 Scripts Disponibles

- `npm start` - Inicia la aplicación en modo desarrollo
- `npm build` - Construye la aplicación para producción
- `npm test` - Ejecuta las pruebas unitarias
- `npm run eject` - Expone la configuración de Create React App

## 📋 Funcionalidades Implementadas

### 🔐 Autenticación y Autorización
- Registro de usuarios con validación
- Inicio de sesión con JWT
- Cerrar sesión seguro
- Protección de rutas por roles
- Gestión de roles (Reader/Admin)
- Contexto de autenticación global

### 📚 Gestión de Libros
- Listar libros con filtros avanzados
- Crear nuevos libros (Admin)
- Editar libros existentes (Admin)
- Eliminar libros (Admin)
- Vista pública de catálogo
- Gestión de copias de libros

### 📖 Gestión de Préstamos
- Crear préstamos (Admin)
- Listar préstamos por usuario
- Gestionar devoluciones (Admin)
- Historial completo de préstamos
- Modal para creación rápida de préstamos
- Estadísticas de devoluciones

### 💰 Gestión de Multas
- Visualizar multas del usuario
- Gestión completa de multas (Admin)
- Cálculo automático de multas
- Estado de cuenta del lector
- Historial de multas

### 👨‍💼 Administración
- Panel administrativo completo
- Búsqueda avanzada de lectores
- Gestión integral de la biblioteca
- Estadísticas en tiempo real
- Dashboard con métricas importantes

## 🎯 Características Técnicas

### Arquitectura
- **Componentes modulares** y reutilizables
- **Separación de responsabilidades** clara
- **Hooks personalizados** para lógica de negocio
- **Context API** para estado global
- **Servicios especializados** por dominio

### UI/UX
- **Diseño responsive** para todos los dispositivos
- **Componentes Bootstrap** para consistencia
- **Alertas elegantes** con SweetAlert2
- **Loading states** para mejor UX
- **Validación de formularios** en tiempo real

### Seguridad
- **Autenticación JWT** segura
- **Protección de rutas** por roles
- **Validación de datos** en frontend y backend
- **Manejo seguro de tokens**

## 📊 Evaluación

Este proyecto corresponde a la **Evaluación 3 (40%)** de la asignatura **Electivo III - Programación de Aplicaciones Web** de la carrera **Ingeniería en Computación e Informática**.

### Criterios de Evaluación Cumplidos
- ✅ **Construcción de componentes modulares** - Arquitectura bien estructurada
- ✅ **Visualización de secciones** - Interfaz completa y funcional
- ✅ **Carga de datos desde API REST** - Integración completa con backend
- ✅ **Gestión de estado** - Context API y hooks personalizados
- ✅ **Navegación** - React Router con rutas protegidas
- ✅ **Responsive Design** - Adaptable a diferentes dispositivos

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

Desarrollado como parte del proyecto académico de **Ingeniería en Computación e Informática**.

---

**Library App** - Transformando la gestión de bibliotecas en la era digital 📚✨
