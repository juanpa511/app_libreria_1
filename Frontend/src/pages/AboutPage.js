import React from 'react';
import '../styles/AboutPage.css'; 

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Juan Pablo Maldonado Valenzurla',
      role: 'Desarrollador Frontend',
      email: 'jpvalenzuela2001@gmail.com',
      description: 'Especialista en React y desarrollo de interfaces de usuario.',
      avatar: '👨‍💻'
    },
    {
      name: 'Juan Andres Meza',
      role: 'Desarrolladora Backend',
      email: 'juan.meza@alu.ucm.cl',
      description: 'Experta en Spring Boot y arquitectura de APIs REST.',
      avatar: '👨‍💻'
    }
  ];

  return (
    <div className="about-page">
      <div className="container">
        {/* Hero Section */}
        <section className="about-hero">
          <h1>Acerca de Nosotros</h1>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <h2>Nuestro Equipo</h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-member">
                <div className="member-avatar">
                  <span>{member.avatar}</span>
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                  <p className="member-description">{member.description}</p>
                  <div className="member-contact">
                    <a href={`mailto:${member.email}`} className="contact-link">
                      📧 {member.email}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Project Section */}
        <section className="project-section">
          <h2>Sobre el Proyecto</h2>
          <div className="project-content">
            <div className="project-info">
              <h3>Sistema de Gestión Bibliotecaria</h3>
              <p>
                Este proyecto forma parte de la evaluación del curso de 
                <strong> Programación de Aplicaciones Web</strong>, donde aplicamos 
                conocimientos de desarrollo frontend y backend para crear una 
                solución completa.
              </p>
              
              <div className="tech-stack">
                <h4>Tecnologías Utilizadas:</h4>
                <div className="tech-tags">
                  <span className="tech-tag">React.js</span>
                  <span className="tech-tag">Spring Boot</span>
                  <span className="tech-tag">REST APIs</span>
                  <span className="tech-tag">JavaScript</span>
                  <span className="tech-tag">CSS3</span>
                  <span className="tech-tag">HTML5</span>
                </div>
              </div>
            </div>
            
            <div className="project-features">
              <h4>Características Principales:</h4>
              <ul>
                <li>✅ Gestión de usuarios (lectores y administradores)</li>
                <li>✅ Catálogo de libros con filtros avanzados</li>
                <li>✅ Sistema de préstamos y devoluciones</li>
                <li>✅ Gestión de multas</li>
                <li>✅ Interfaz responsive y moderna</li>
                <li>✅ Autenticación y autorización</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Academic Info Section */}
        <section className="academic-section">
          <h2>Información Académica</h2>
          <div className="academic-grid">
            <div className="academic-card">
              <h3>Curso</h3>
              <p>Programación de Aplicaciones Web</p>
            </div>
            <div className="academic-card">
              <h3>Carrera</h3>
              <p>Ingeniería en Computación e Informática</p>
            </div>
            <div className="academic-card">
              <h3>Docente</h3>
              <p>Román Gajardo</p>
            </div>
            <div className="academic-card">
              <h3>Evaluación</h3>
              <p>Evaluación 2 - 40%</p>
              <p>Evaluación 3 - 40%</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;