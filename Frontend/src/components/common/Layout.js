import React from 'react';
import Header from './Header'; // Ajusta la ruta según tu estructura
import Footer from './Footer'; // Ajusta la ruta según tu estructura

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;