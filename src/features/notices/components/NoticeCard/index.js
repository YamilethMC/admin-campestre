import React, { useState, useEffect, useRef } from 'react';
import Modal from '../../../../shared/components/modal';
import { cardStyles } from './Style';

const NoticeCard = ({ notice, onEdit, onToggleStatus, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const formatDateForInput = isoString => {
    if (!isoString) return '';

    const date = new Date(isoString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const getStatusColor = active => {
    return active ? cardStyles.statusTag.active : cardStyles.statusTag.inactive;
  };

  const handleToggleStatus = async () => {
    await onToggleStatus(notice.id, notice.active);
    setIsMenuOpen(false);
  };

  const handleEdit = () => {
    onEdit(notice);
    setIsMenuOpen(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setIsMenuOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (onDelete) {
      await onDelete(notice.id);
    }
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className={cardStyles.container}>
      <div className={cardStyles.cardTop}>
        <div className={cardStyles.contentContainer}>
          <h3 className={cardStyles.title}>{notice.title}</h3>
          <p className={cardStyles.description}>{notice.message}</p>

          <div className={cardStyles.infoContainer}>
            <div className={cardStyles.infoItem}>
              <svg
                className={cardStyles.infoIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10m-11 8h12a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {formatDateForInput(notice.sentDate)}
            </div>

            {notice.visibleUntil && (
              <div className={cardStyles.infoItem}>
                <svg
                  className={cardStyles.infoIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {formatDateForInput(notice.visibleUntil)}
              </div>
            )}

            {/*{notice.dateUpdated && notice.dateUpdated !== notice.dateCreated && (
              <div className={cardStyles.infoItem}>
                <svg className={cardStyles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Actualizado: {notice.dateUpdated}
              </div>
            )}*/}
          </div>

          <div className={cardStyles.tagsContainer}>
            <span className={`${cardStyles.tag} ${getStatusColor(notice.active)}`}>
              {notice.active ? 'Activo' : 'Inactivo'}
            </span>

            {notice.type && (
              <span className={`${cardStyles.tag} ${cardStyles.typeTag}`}>{notice.type}</span>
            )}
          </div>
        </div>

        {/* Options menu */}
        <div className="relative ml-4">
          <button
            ref={buttonRef}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cardStyles.optionsButton}
            aria-label="Opciones"
          >
            <svg className={cardStyles.optionsButtonIcon} fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {isMenuOpen && (
            <div
              ref={menuRef}
              className={cardStyles.optionsMenu}
              style={{
                bottom: '100%',
                marginBottom: '0.5rem',
              }}
            >
              <button onClick={handleToggleStatus} className={cardStyles.optionsMenuItem}>
                {notice.active ? 'Desactivar' : 'Activar'}
              </button>
              <button onClick={handleEdit} className={cardStyles.optionsMenuItem}>
                Editar
              </button>
              {onDelete && (
                <button onClick={handleDeleteClick} className={cardStyles.deleteMenuItem}>
                  Eliminar
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {onDelete && (
        <Modal
          isOpen={showDeleteModal}
          title="Confirmar eliminación"
          onClose={handleCancelDelete}
          footer={
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                Eliminar
              </button>
            </div>
          }
        >
          <p>
            ¿Está seguro de que desea eliminar el aviso "{notice.title}"? Esta acción no se puede
            deshacer.
          </p>
        </Modal>
      )}
    </div>
  );
};

export default NoticeCard;
