import React from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/BookCard.css';

const BookCard = ({ book, onBorrow, onEdit, onDelete, showActions = true }) => {
  const { user } = useAuth();
  
  const getUserRole = () => {
    return user?.role || user?.roles?.[0] || 'READER';
  };

  const handleBorrow = () => {
    if (onBorrow && book.available) {
      onBorrow(book);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(book);
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm(`¿Estás seguro de que quieres eliminar el libro "${book.title}"?`)) {
      onDelete(book.id);
    }
  };

  const getStatusInfo = () => {
    if (book.available === true || book.status === 'disponible') {
      return { text: 'Disponible', class: 'status-available', icon: '✅' };
    } else if (book.status === 'prestado') {
      return { text: 'Prestado', class: 'status-borrowed', icon: '📤' };
    } else if (book.status === 'reservado') {
      return { text: 'Reservado', class: 'status-reserved', icon: '🔒' };
    } else {
      return { text: 'No disponible', class: 'status-unavailable', icon: '❌' };
    }
  };

  const getTypeInfo = (type) => {
    const typeMap = {
      'ficcion': { text: 'Ficción', class: 'type-fiction', icon: '📖' },
      'no ficcion': { text: 'No Ficción', class: 'type-nonfiction', icon: '📚' },
      'ciencia': { text: 'Ciencia', class: 'type-science', icon: '🔬' },
      'historia': { text: 'Historia', class: 'type-history', icon: '🏛️' },
      'arte': { text: 'Arte', class: 'type-art', icon: '🎨' },
      'tecnologia': { text: 'Tecnología', class: 'type-tech', icon: '💻' },
      'literatura': { text: 'Literatura', class: 'type-literature', icon: '✍️' },
      'educacion': { text: 'Educación', class: 'type-education', icon: '🎓' },
      'novela': { text: 'Novela', class: 'type-novel', icon: '📚' },
      'aventura': { text: 'Aventura', class: 'type-adventure', icon: '🗺️' },
      'poemas': { text: 'Poemas', class: 'type-poetry', icon: '📝' }
    };
    
    return typeMap[type?.toLowerCase()] || { text: type || 'General', class: 'type-general', icon: '📚' };
  };

  const statusInfo = getStatusInfo();
  const typeInfo = getTypeInfo(book.type || book.genre);
  const userRole = getUserRole();

  return (
    <div className="book-card">
      <div className="book-image">
        {book.imagen64 ? (
          <img src={`data:image/jpeg;base64,${book.imagen64}`} alt={book.title} />
        ) : book.image ? (
          <img src={book.image} alt={book.title} />
        ) : book.cover ? (
          <img src={book.cover} alt={book.title} />
        ) : (
          <div className="book-placeholder">
            <span className="book-placeholder-icon">📚</span>
          </div>
        )}
        <div className="book-overlay">
          <span className={`status-badge ${statusInfo.class}`}>
            {statusInfo.icon} {statusInfo.text}
          </span>
        </div>
      </div>
      
      <div className="book-info">
        <h3 className="book-title" title={book.title}>
          {book.title}
        </h3>
        <p className="book-author">por {book.author}</p>
        
        <div className="book-details">
          <div className="book-detail-item">
            <span className="detail-label">ISBN:</span>
            <span className="detail-value">{book.isbn}</span>
          </div>
          
          {(book.publicationYear || book.publishedYear) && (
            <div className="book-detail-item">
              <span className="detail-label">Año:</span>
              <span className="detail-value">{book.publicationYear || book.publishedYear}</span>
            </div>
          )}
          
          {book.pages && (
            <div className="book-detail-item">
              <span className="detail-label">Páginas:</span>
              <span className="detail-value">{book.pages}</span>
            </div>
          )}
          
          {book.publisher && (
            <div className="book-detail-item">
              <span className="detail-label">Editorial:</span>
              <span className="detail-value">{book.publisher}</span>
            </div>
          )}
          
          {book.language && (
            <div className="book-detail-item">
              <span className="detail-label">Idioma:</span>
              <span className="detail-value">
                {book.language === 'es' ? 'Español' : 
                 book.language === 'en' ? 'Inglés' : 
                 book.language}
              </span>
            </div>
          )}
        </div>

        <div className="book-badges">
          <span className={`type-badge ${typeInfo.class}`}>
            {typeInfo.icon} {typeInfo.text}
          </span>
          {book.copies && (
            <span className="copies-badge">
              📊 {book.copies} copias
            </span>
          )}
        </div>

        {book.description && (
          <p className="book-description" title={book.description}>
            {book.description.length > 100 
              ? `${book.description.substring(0, 100)}...` 
              : book.description}
          </p>
        )}

        {showActions && (
          <div className="book-actions">
            {userRole === 'READER' && (
              <button 
                className={`btn btn-borrow ${!book.available ? 'btn-disabled' : ''}`}
                onClick={handleBorrow}
                disabled={!book.available}
                title={book.available ? 'Solicitar préstamo' : 'No disponible'}
              >
                {book.available ? '📋 Solicitar Préstamo' : '❌ No Disponible'}
              </button>
            )}
            
            {userRole === 'ADMIN' && (
              <div className="admin-actions">
                <button 
                  className="btn btn-edit"
                  onClick={handleEdit}
                  title="Editar libro"
                >
                  ✏️ Editar
                </button>
                <button 
                  className="btn btn-delete"
                  onClick={handleDelete}
                  title="Eliminar libro"
                >
                  🗑️ Eliminar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;