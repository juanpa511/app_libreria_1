import React from 'react';
import '../../styles/BookCard.css'; 

const BookCard = ({ book, onBorrow, onEdit, onDelete, userRole, showActions = true }) => {
  const handleBorrow = () => {
    if (onBorrow) {
      onBorrow(book);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(book);
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('¿Estás seguro de que quieres eliminar este libro?')) {
      onDelete(book.id);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'disponible':
        return 'status-available';
      case 'prestado':
        return 'status-borrowed';
      case 'reservado':
        return 'status-reserved';
      default:
        return 'status-unknown';
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'ficcion':
        return 'type-fiction';
      case 'no ficcion':
        return 'type-nonfiction';
      case 'ciencia':
        return 'type-science';
      case 'historia':
        return 'type-history';
      case 'arte':
        return 'type-art';
      default:
        return 'type-general';
    }
  };

  return (
    <div className="book-card">
      <div className="book-image">
      {book.imagen64 ? (
        <img src={`data:image/jpeg;base64,${book.imagen64}`} alt={book.title} />
          ) : (
            <div className="book-placeholder">
             <span>📚</span>
          </div>
        )}
      </div>
      
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">por {book.author}</p>
        
        <div className="book-details">
          <p className="book-isbn">ISBN: {book.isbn}</p>
          <p className="book-year">Año: {book.publicationYear}</p>
          {book.genre && <p className="book-genre">Género: {book.genre}</p>}
          {book.pages && <p className="book-pages">Páginas: {book.pages}</p>}
        </div>

        <div className="book-badges">
          <span className={`status-badge ${getStatusColor(book.status)}`}>
            {book.status || 'Disponible'}
          </span>
          {book.type && (
            <span className={`type-badge ${getTypeColor(book.type)}`}>
              {book.type}
            </span>
          )}
        </div>

        {book.description && (
          <p className="book-description">{book.description}</p>
        )}

        {showActions && (
          <div className="book-actions">
            {userRole === 'READER' && book.status === 'disponible' && (
              <button 
                className="btn btn-borrow"
                onClick={handleBorrow}
              >
                Solicitar Préstamo
              </button>
            )}
            
            {userRole === 'ADMIN' && (
              <>
                <button 
                  className="btn btn-edit"
                  onClick={handleEdit}
                >
                  Editar
                </button>
                <button 
                  className="btn btn-delete"
                  onClick={handleDelete}
                >
                  Eliminar
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;