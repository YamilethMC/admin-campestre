import React, { useState } from 'react';
import Modal from '../../../../shared/components/modal';

const HelpCenterList = ({ helpCenters, loading, onAddHelpCenter, onEdit, onDelete }) => {
  const [selectedHelpCenter, setSelectedHelpCenter] = useState(null);
  const [showMenu, setShowMenu] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleMenuToggle = (helpCenter, e) => {
    e.stopPropagation();
    setSelectedHelpCenter(helpCenter);
    setShowMenu(showMenu === helpCenter.id ? null : helpCenter.id);
  };

  const handleEdit = () => {
    if (selectedHelpCenter) {
      onEdit(selectedHelpCenter);
      setShowMenu(null);
    }
  };

  const handleDelete = () => {
    if (selectedHelpCenter) {
      setShowDeleteModal(true);
      setShowMenu(null);
    }
  };

  const confirmDelete = () => {
    if (selectedHelpCenter) {
      onDelete(selectedHelpCenter.id);
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Entradas del centro de ayuda</h2>
        <button
          onClick={onAddHelpCenter}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Agregar pregunta
        </button>
      </div>

      {!helpCenters || helpCenters.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-1">No se encontraron preguntas</h3>
          <p className="text-gray-500 mb-6">
            Aún no hay preguntas y respuestas en el centro de ayuda
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {helpCenters.map(helpCenter => (
            <div
              key={helpCenter.id}
              className="bg-white rounded-lg shadow p-6 border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{helpCenter.question}</h3>
                  <p className="text-gray-600 whitespace-pre-line">{helpCenter.answer}</p>
                </div>

                <div className="relative">
                  <button
                    onClick={e => handleMenuToggle(helpCenter, e)}
                    className="text-gray-600 hover:text-gray-900 p-1 rounded-md hover:bg-gray-100 transition-colors"
                    aria-label="Menú de opciones"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>

                  {showMenu === helpCenter.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                      <button
                        onClick={handleEdit}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Editar
                      </button>
                      <button
                        onClick={handleDelete}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                Creado: {new Date(helpCenter.createdAt).toLocaleDateString('es-ES')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        title="Confirmar eliminación"
        onClose={cancelDelete}
        footer={
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={cancelDelete}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="px-4 py-2 bg-error hover:bg-red-700 text-white rounded-md transition-colors"
            >
              Aceptar
            </button>
          </div>
        }
      >
        <p>¿Está seguro que desea eliminar esta pregunta?</p>
      </Modal>
    </div>
  );
};

export default HelpCenterList;
