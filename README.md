# 📚 Sistema de Gestión de Biblioteca

Un sistema completo de gestión de biblioteca desarrollado con tecnologías modernas, que permite administrar libros, préstamos, multas y usuarios de manera eficiente.

## 👥 Equipo de Desarrollo

### **Juan Maldonado** - Desarrollador Frontend
- **Rol**: Desarrollador Frontend
- **Responsabilidades**: 
  - Desarrollo de la interfaz de usuario con React
  - Implementación de componentes reutilizables
  - Gestión del estado de la aplicación
  - Integración con APIs REST
  - Diseño responsivo y experiencia de usuario

### **Juan Meza** - Desarrollador Backend
- **Rol**: Desarrollador Backend
- **Responsabilidades**:
  - Desarrollo de APIs REST con Spring Boot
  - Implementación de autenticación JWT
  - Gestión de base de datos MySQL
  - Configuración de seguridad
  - Lógica de negocio y servicios

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 18.2.0** - Biblioteca para interfaces de usuario
- **React Router DOM 6.8.0** - Enrutamiento de la aplicación
- **Axios 1.3.0** - Cliente HTTP para peticiones API
- **Bootstrap 5.2.3** - Framework CSS para diseño responsivo
- **React Bootstrap 2.7.0** - Componentes Bootstrap para React
- **Styled Components 5.3.6** - CSS-in-JS para estilos

### Backend
- **Spring Boot 3.5.3** - Framework para aplicaciones Java
- **Spring Security** - Autenticación y autorización
- **Spring Data JPA** - Persistencia de datos
- **MySQL 8.0.33** - Base de datos relacional
- **JWT (JSON Web Tokens)** - Autenticación stateless
- **Lombok** - Reducción de código boilerplate
- **Java 21** - Lenguaje de programación

## 📋 Funcionalidades Principales

### 🔐 Autenticación y Autorización
- Registro e inicio de sesión de usuarios
- Autenticación JWT
- Roles de usuario (Admin, Lector)
- Rutas protegidas

### 📖 Gestión de Libros
- CRUD completo de libros
- Búsqueda y filtrado avanzado
- Gestión de copias disponibles
- Categorización por género y autor

### 📚 Gestión de Préstamos
- Creación de préstamos
- Devolución de libros
- Historial de préstamos
- Control de fechas de vencimiento

### 💰 Sistema de Multas
- Cálculo automático de multas por retraso
- Gestión de pagos
- Historial de multas por usuario

### 👥 Gestión de Usuarios
- Registro de lectores
- Perfiles de usuario
- Historial de actividad

## 🛠️ Instalación y Configuración

### Prerrequisitos
- **Java 21** o superior
- **Node.js 16** o superior
- **MySQL 8.0** o superior
- **Maven 3.6** o superior

### Configuración de la Base de Datos

1. **Crear la base de datos MySQL:**
```sql
CREATE DATABASE biblioteca;
```

2. **Configurar las credenciales** en `backend/apirest/src/main/resources/application.properties`:
```properties
spring.datasource.username=tu_usuario
spring.datasource.password=tu_password
```

### Instalación del Backend

1. **Navegar al directorio del backend:**
```bash
cd backend/apirest
```

2. **Instalar dependencias:**
```bash
mvn clean install
```

3. **Ejecutar la aplicación:**
```bash
mvn spring-boot:run
```

El backend estará disponible en: `http://localhost:8087/api`

### Instalación del Frontend

1. **Navegar al directorio del frontend:**
```bash
cd Frontend
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Ejecutar la aplicación:**
```bash
npm start
```

El frontend estará disponible en: `http://localhost:3000`

## 📁 Estructura del Proyecto

```
app_libreria/
├── backend/
│   └── apirest/
│       ├── src/main/java/com/tallerjj/apirest/
│       │   ├── controller/     # Controladores REST
│       │   ├── entity/         # Entidades JPA
│       │   ├── repository/     # Repositorios de datos
│       │   ├── service/        # Lógica de negocio
│       │   ├── security/       # Configuración de seguridad
│       │   └── dto/           # Objetos de transferencia
│       └── src/main/resources/
│           └── application.properties
└── Frontend/
    ├── src/
    │   ├── components/         # Componentes React
    │   ├── pages/             # Páginas de la aplicación
    │   ├── services/          # Servicios de API
    │   ├── context/           # Contexto de autenticación
    │   ├── hooks/             # Hooks personalizados
    │   └── styles/            # Archivos CSS
    └── public/
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno

**Backend** (`application.properties`):
```properties
# Configuración de la base de datos
spring.datasource.url=jdbc:mysql://localhost:3306/biblioteca
spring.datasource.username=root
spring.datasource.password=root

# Configuración JWT
jwt.secret=tu_clave_secreta_jwt
jwt.expiration=86400000
```

### Scripts Útiles

**Backend:**
```bash
# Compilar y ejecutar
mvn spring-boot:run

# Ejecutar tests
mvn test

# Limpiar y compilar
mvn clean install
```

**Frontend:**
```bash
# Ejecutar en modo desarrollo
npm start

# Construir para producción
npm run build

# Ejecutar tests
npm test
```

## 🚀 Despliegue

### Backend (Producción)
```bash
cd backend/apirest
mvn clean package
java -jar target/apirest-0.0.1-SNAPSHOT.jar
```

### Frontend (Producción)
```bash
cd Frontend
npm run build
# Servir la carpeta build con un servidor web
```

## 📊 Características Técnicas

### Seguridad
- Autenticación JWT
- Encriptación de contraseñas
- Validación de roles
- CORS configurado

### Base de Datos
- MySQL 8.0
- JPA/Hibernate
- Migraciones automáticas
- Relaciones optimizadas

### API REST
- Endpoints RESTful
- Respuestas JSON
- Manejo de errores
- Documentación de endpoints

### Frontend
- Diseño responsivo
- Componentes reutilizables
- Gestión de estado
- Navegación SPA


## 📞 Contacto

- **Juan Maldonado** - Desarrollador Frontend
- **Juan Meza** - Desarrollador Backend



