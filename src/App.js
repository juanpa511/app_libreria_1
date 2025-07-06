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
import SearchReaderPage from './pages/SearchReaderPage';
import CreateBookPage from './pages/CreateBookPage';
import LoanPage from './pages/LoanPage';
import ReturnPage from './pages/ReturnPage';

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
                <ProtectedRoute requireAdmin={true}>
                  <AdminBooksPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/loans" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminLoansPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/fines" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminFinesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/search-reader" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <SearchReaderPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/create-book" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <CreateBookPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/loan" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <LoanPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/return" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <ReturnPage />
                </ProtectedRoute>
              } 
            />

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;