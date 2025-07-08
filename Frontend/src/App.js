import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Importar páginas
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';

// Páginas de lectores
import BooksPage from './pages/BooksPage';
import MyLoansPage from './pages/MyLoansPage';
import MyFinesPage from './pages/MyFinesPage';

// Páginas de administrador
import AdminBooksPage from './pages/Admin/AdminBooksPage';
import AdminLoansPage from './pages/Admin/AdminLoansPage';
import AdminFinesPage from './pages/Admin/AdminFinesPage';
import AdminReturnsPage from './pages/Admin/AdminReturnsPage';
import SearchReaderPage from './pages/SearchReaderPage';
import CreateBookPage from './pages/CreateBookPage';
import LoanPage from './pages/LoanPage';
import ReturnPage from './pages/ReturnPage';
import BooksPublicPage from './pages/BooksPublicPage';

// Estilos
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Rutas protegidas para lectores */}
            <Route 
              path="/books" 
              element={
                <ProtectedRoute>
                  <BooksPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-loans" 
              element={
                <ProtectedRoute>
                  <MyLoansPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-fines" 
              element={
                <ProtectedRoute>
                  <MyFinesPage />
                </ProtectedRoute>
              } 
            />

            {/* Rutas protegidas para administradores */}
            <Route 
              path="/admin/books" 
              element={
                <ProtectedRoute requiredRole={1}>
                  <AdminBooksPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/loans" 
              element={
                <ProtectedRoute requiredRole={1}>
                  <AdminLoansPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/fines" 
              element={
                <ProtectedRoute requiredRole={1}>
                  <AdminFinesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/search-reader" 
              element={
                <ProtectedRoute requiredRole={1}>
                  <SearchReaderPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/create-book" 
              element={
                <ProtectedRoute requiredRole={1}>
                  <CreateBookPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/loan" 
              element={
                <ProtectedRoute requiredRole={1}>
                  <LoanPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/return" 
              element={
                <ProtectedRoute requiredRole={1}>
                  <AdminReturnsPage />
                </ProtectedRoute>
              } 
            />

            {/* Rutas públicas */}
            <Route path="/public-books" element={<BooksPublicPage />} />

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;