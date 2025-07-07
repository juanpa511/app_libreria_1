import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css'; 
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Logo y descripción */}
          <div className="footer-section">
            <h3 className="footer-logo">📚 Library</h3>
            <p className="footer-description">
              Sistema de gestión de biblioteca desarrollado con React y Spring Boot.
              Facilitando el acceso a la información y la gestión de préstamos.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div className="footer-section">
            <h4 className="footer-title">Enlaces Rápidos</h4>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">Inicio</Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">Acerca de</Link>
              </li>
              <li>
                <Link to="/books" className="footer-link">Catálogo</Link>
              </li>
              <li>
                <Link to="/login" className="footer-link">Iniciar Sesión</Link>
              </li>
            </ul>
          </div>

          {/* Servicios */}
          <div className="footer-section">
            <h4 className="footer-title">Servicios</h4>
            <ul className="footer-links">
              <li>
                <span className="footer-link">Préstamo de Libros</span>
              </li>
              <li>
                <span className="footer-link">Gestión de Multas</span>
              </li>
              <li>
                <span className="footer-link">Búsqueda Avanzada</span>
              </li>
              <li>
                <span className="footer-link">Reservas Online</span>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="footer-section">
            <h4 className="footer-title">Contacto</h4>
            <div className="footer-contact">
              <p className="contact-item">
                <span className="contact-icon">📧</span>
                biblioteca@example.com
              </p>
              <p className="contact-item">
                <span className="contact-icon">📞</span>
                +56 9 1234 5678
              </p>
              <p className="contact-item">
                <span className="contact-icon">📍</span>
                Talca, Región del Maule, Chile
              </p>
              <p className="contact-item">
                <span className="contact-icon">🕒</span>
                Lun - Vie: 8:00 - 18:00
              </p>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="footer-divider"></div>

        {/* Copyright */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>
              © {currentYear} Library App. Todos los derechos reservados.
            </p>
            <p className="footer-credits">
              Desarrollado con ❤️ por estudiantes de ICI - Programación de Aplicaciones Web
            </p>
          </div>
          
          <div className="footer-tech">
            <p className="tech-stack">
              <span className="tech-item">React</span>
              <span className="tech-item">Spring Boot</span>
              <span className="tech-item">MySQL</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;