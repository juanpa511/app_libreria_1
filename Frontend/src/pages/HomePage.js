import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/common/Layout';
import '../styles/HomePage.css';

const HomePage = () => {
  useEffect(() => {
    const shapes = document.querySelectorAll('.shape');

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.1;
        shape.style.transform = `translateY(${scrolled * speed}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .stat-card, .step').forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.6s ease';
      observer.observe(el);
    });

    document.querySelectorAll('.btn').forEach((btn) => {
      btn.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-3px) scale(1.05)';
      });

      btn.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
      });
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <Layout>
      <div>
        <div className="floating-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>

        <div className="container">
          <header className="header">
            <h1>Bienvenido a la Biblioteca Digital</h1>
            <p>Descubre un mundo de conocimiento al alcance de tus manos</p>

            <div className="auth-buttons">
              <Link to="/login" className="btn btn-primary">INICIAR SESIÓN</Link>
              <Link to="/register" className="btn btn-secondary">REGISTRARSE</Link>
              <Link to="/public-books" className="btn btn-tertiary">VER LIBROS</Link>
            </div>
          </header>

          <section>
            <h2 className="section-title">¿Por qué elegir nuestra biblioteca?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📚</div>
                <h3>Amplio Catálogo</h3>
                <p>Miles de libros disponibles en diferentes géneros y formatos para todos los gustos.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔍</div>
                <h3>Búsqueda Avanzada</h3>
                <p>Filtros inteligentes y recomendaciones personalizadas.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🕒</div>
                <h3>Disponible 24/7</h3>
                <p>Accede desde cualquier lugar, en cualquier momento.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">👥</div>
                <h3>Comunidad</h3>
                <p>Comparte opiniones y recomendaciones con otros lectores.</p>
              </div>
            </div>
          </section>

          <section>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number pulse">1,500+</div>
                <div className="stat-label">Libros Disponibles</div>
              </div>
              <div className="stat-card">
                <div className="stat-number pulse">500+</div>
                <div className="stat-label">Usuarios Activos</div>
              </div>
              <div className="stat-card">
                <div className="stat-number pulse">50+</div>
                <div className="stat-label">Géneros</div>
              </div>
              <div className="stat-card">
                <div className="stat-number pulse">24/7</div>
                <div className="stat-label">Soporte</div>
              </div>
            </div>
          </section>

          <section className="how-it-works">
            <h2 className="section-title">¿Cómo funciona?</h2>
            <div className="steps-container">
              <div className="step">
                <div className="step-number">1</div>
                <h3>Regístrate</h3>
                <p>Crea tu cuenta gratuita y accede al catálogo completo.</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h3>Busca</h3>
                <p>Encuentra libros con nuestros filtros avanzados.</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h3>Solicita</h3>
                <p>Pide prestado el libro que quieres leer.</p>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <h3>Disfruta</h3>
                <p>Lee desde cualquier dispositivo cuando quieras.</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
