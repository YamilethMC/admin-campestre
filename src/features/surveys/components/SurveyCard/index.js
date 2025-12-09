import React, { useState, useEffect, useRef } from 'react';
import { SurveyPriority, SurveyCategory } from '../../interfaces';
import Modal from '../../../../shared/components/modal';

const SurveyCard = ({ survey, onEdit, onViewResponses, onToggleStatus, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Close menu when clicking outside
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'SERVICES':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'RESTAURANT':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'SPORTS':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'EVENTS':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (isActive) => {
    return isActive
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Function to translate API priority to display value
  const getDisplayPriority = (priority) => {
    switch (priority) {
      case 'HIGH':
        return SurveyPriority.HIGH; // 'Importante'
      case 'MEDIUM':
        return SurveyPriority.MEDIUM; // 'Normal'
      case 'LOW':
        return SurveyPriority.LOW; // 'Baja'
      default:
        return priority;
    }
  };

  // Function to translate API category to display value
  const getDisplayCategory = (category) => {
    switch (category) {
      case 'SERVICES':
        return SurveyCategory.SERVICES; // 'Servicios'
      case 'RESTAURANT':
        return SurveyCategory.RESTAURANT; // 'Restaurante'
      case 'SPORTS':
        return SurveyCategory.SPORTS; // 'Deportes'
      case 'EVENTS':
        return SurveyCategory.EVENTS; // 'Eventos'
      case 'TODAS':
        return SurveyCategory.ALL; // 'Todas'
      default:
        return category;
    }
  };

  // Toggle active status
  const handleToggleStatus = async () => {
    await onToggleStatus(survey.id);
    setIsMenuOpen(false);
  };

  const handleEdit = () => {
    onEdit(survey);
    setIsMenuOpen(false);
  };

  const handleViewResponses = () => {
    onViewResponses(survey);
    setIsMenuOpen(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setIsMenuOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (onDelete) {
      await onDelete(survey.id);
    }
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        {survey.image && (
          <div className="shrink-0 mr-4">
            <img
              src={survey.image}
              alt={survey.title}
              className="w-16 h-16 object-cover rounded-md"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 text-lg mb-1 truncate">{survey.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{survey.description}</p>

          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {survey.timeStimed || 'N/A'}
            </div>

            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {survey.participantCount || 0} personas
            </div>

            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {survey.questionCount || 0} preguntas
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getPriorityColor(survey.priority)}`}>
              {getDisplayPriority(survey.priority)}
            </span>
            <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getCategoryColor(survey.category)}`}>
              {getDisplayCategory(survey.category)}
            </span>
            <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(survey.active)}`}>
              {survey.active ? 'Activa' : 'Inactiva'}
            </span>
          </div>
        </div>

        {/* Options menu */}
        <div className="relative ml-4">
          <button
            ref={buttonRef}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Opciones"
          >
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {isMenuOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
              style={{
                bottom: '100%',
                marginBottom: '0.5rem' // 2 * 0.25rem (0.5rem = 2px)
              }}
            >
              <button
                onClick={handleToggleStatus}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {survey.active ? 'Desactivar' : 'Activar'}
              </button>
              <button
                onClick={handleEdit}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Editar
              </button>
              <button
                onClick={handleViewResponses}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Ver respuestas
              </button>
              {onDelete && (
              <button
                onClick={handleDeleteClick}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
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
          <p>¿Está seguro de que desea eliminar la encuesta "{survey.title}"? Esta acción no se puede deshacer.</p>
        </Modal>
      )}
    </div>
  );
};

export default SurveyCard;