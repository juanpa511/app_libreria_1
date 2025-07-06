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
      email: 'juan@gmail.com',
      description: 'Experta en Spring Boot y arquitectura de APIs REST.',
      avatar: '👩‍💻'
    }
  ];

  return (
    <div className="about-page">
      <div className="container">
        {/* Hero Section */}
        <section className="about-hero">
          <h1>Acerca de Nosotros</h1>
          <p className="hero-subtitle">
            Somos un equipo apasionado por la tecnología y la educación, 
            trabajando juntos para crear soluciones innovadoras en el mundo digital.
          </p>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="mission-content">
            <h2>Nuestra Misión</h2>
            <p>
              Facilitar el acceso al conocimiento mediante una plataforma digital 
              intuitiva y eficiente que conecte a lectores con una amplia variedad 
              de recursos bibliográficos.
            </p>
          </div>
          <div className="mission-image">
            <span className="mission-icon">🎯</span>
          </div>
        </section>

        {/* Vision Section */}
        <section className="vision-section">
          <div className="vision-image">
            <span className="vision-icon">🚀</span>
          </div>
          <div className="vision-content">
            <h2>Nuestra Visión</h2>
            <p>
              Convertirnos en la plataforma líder de gestión bibliotecaria, 
              promoviendo la lectura y el aprendizaje continuo a través de 
              tecnologías innovadoras.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <h2>Nuestros Valores</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Colaboración</h3>
              <p>Trabajamos en equipo para lograr objetivos comunes</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💡</div>
              <h3>Innovación</h3>
              <p>Buscamos constantemente mejores formas de hacer las cosas</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🎓</div>
              <h3>Aprendizaje</h3>
              <p>Promovemos el crecimiento personal y profesional continuo</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌟</div>
              <h3>Excelencia</h3>
              <p>Nos esforzamos por entregar la mejor calidad en todo lo que hacemos</p>
            </div>
          </div>
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
              <p>Evaluación 3 - 40%</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <h2>¿Tienes Preguntas?</h2>
          <p>
            Si tienes alguna pregunta sobre el proyecto o quieres saber más 
            sobre nuestro trabajo, no dudes en contactarnos.
          </p>
          <div className="contact-info">
            <p>📧 Email: equipo@biblioteca.com</p>
            <p>🌐 GitHub: github.com/biblioteca-proyecto</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;