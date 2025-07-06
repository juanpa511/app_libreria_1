import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css'; 

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Bienvenido a la Biblioteca Digital</h1>
          <p>Descubre un mundo de conocimiento al alcance de tus manos</p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Registrarse
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <span className="hero-icon">📚</span>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>¿Por qué elegir nuestra biblioteca?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📖</div>
              <h3>Amplio Catálogo</h3>
              <p>Miles de libros disponibles en diferentes géneros y formatos</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Búsqueda Avanzada</h3>
              <p>Encuentra fácilmente el libro que buscas con nuestros filtros</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <h3>Disponible 24/7</h3>
              <p>Accede a tu biblioteca personal en cualquier momento</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Comunidad</h3>
              <p>Forma parte de una comunidad de lectores apasionados</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">1,500+</div>
              <div className="stat-label">Libros Disponibles</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Usuarios Activos</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Géneros</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Soporte</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2>¿Cómo funciona?</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Regístrate</h3>
                <p>Crea tu cuenta gratuita en segundos</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Busca</h3>
                <p>Explora nuestro catálogo y encuentra tus libros favoritos</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Solicita</h3>
                <p>Pide prestado el libro que quieres leer</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Disfruta</h3>
                <p>Lee y disfruta tu libro durante el período de préstamo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Books Section */}
      <section className="popular-books">
        <div className="container">
          <h2>Libros Populares</h2>
          <div className="books-showcase">
            <div className="book-showcase-item">
              <div className="book-showcase-image">📚</div>
              <h4>Cien Años de Soledad</h4>
              <p>Gabriel García Márquez</p>
            </div>
            <div className="book-showcase-item">
              <div className="book-showcase-image">📚</div>
              <h4>El Principito</h4>
              <p>Antoine de Saint-Exupéry</p>
            </div>
            <div className="book-showcase-item">
              <div className="book-showcase-image">📚</div>
              <h4>Don Quijote</h4>
              <p>Miguel de Cervantes</p>
            </div>
            <div className="book-showcase-item">
              <div className="book-showcase-image">📚</div>
              <h4>1984</h4>
              <p>George Orwell</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>¿Listo para comenzar?</h2>
          <p>Únete a nuestra comunidad y descubre tu próximo libro favorito</p>
          <Link to="/register" className="btn btn-primary btn-large">
            Comenzar Ahora
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;