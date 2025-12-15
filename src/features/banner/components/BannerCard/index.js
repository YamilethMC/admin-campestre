import React, { useState, useEffect, useRef } from 'react';
import Modal from '../../../../shared/components/modal';

const BannerCard = ({ banner, onEdit, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen &&
          menuRef.current &&
          !menuRef.current.contains(event.target) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const formatDateForInput = (isoString) => {
    if (!isoString) return "";

    const date = new Date(isoString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
  };

  const getStatusColor = (active) => {
    return active
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const getActionTypeLabel = (typeActionId) => {
    const actionTypes = [
      "External link",
      "Internal link", 
      "Open modal",
      "Open document",
      "Shared"
    ];
    
    const spanishLabels = [
      "Enlace externo",
      "Enlace interno",
      "Abrir modal",
      "Abrir documento",
      "Compartir"
    ];
    
    if (typeActionId && typeActionId >= 1 && typeActionId <= 5) {
      return spanishLabels[typeActionId - 1];
    }
    return actionTypes[typeActionId - 1] || "Desconocido";
  };

  const handleEdit = () => {
    onEdit(banner);
    setIsMenuOpen(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setIsMenuOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (onDelete) {
      await onDelete(banner.id);
    }
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Banner Image */}
        <div className="flex items-center gap-3 mb-2 ml-3">
          {banner.image ? (
            <img
              src={banner.image}
              alt={banner.title}
              className="w-16 h-16 object-cover rounded-md"
            />
          ) : (
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-24 md:h-28 flex items-center justify-center text-gray-500">
              Sin imagen
            </div>
          )}
        </div>

        {/* Banner Content */}
        <div className="p-3 md:w-4/5">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-800 mb-1">{banner.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">{banner.description}</p>

              <div className="flex flex-wrap gap-3 mb-3">
                <div className="flex items-center">
                  <p className="text-xs text-gray-500 mr-1">Inicio:</p>
                  <p className="text-xs font-medium">{formatDateForInput(banner.startDate)}</p>
                </div>
                <div className="flex items-center">
                  <p className="text-xs text-gray-500 mr-1">Fin:</p>
                  <p className="text-xs font-medium">{formatDateForInput(banner.endDate)}</p>
                </div>
                <span className={`px-2 py-0.5 text-xs rounded ${getStatusColor(banner.active)}`}>
                  {banner.active ? 'Activo' : 'Inactivo'}
                </span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                  {getActionTypeLabel(banner.typeActionId)}
                </span>
              </div>
            </div>

            {/* Options menu */}
            <div className="relative ml-2">
              <button
                ref={buttonRef}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Opciones"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>

              {isMenuOpen && (
                <div
                  ref={menuRef}
                  className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                  style={{
                    top: '100%',
                    right: '0'
                  }}
                >
                  <button
                    onClick={handleEdit}
                    className="block w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Editar
                  </button>
                  {onDelete && (
                    <button
                      onClick={handleDeleteClick}
                      className="block w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
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
          <p>¿Está seguro de que desea eliminar el banner "{banner.title}"? Esta acción no se puede deshacer.</p>
        </Modal>
      )}
    </div>
  );
};

export default BannerCard;