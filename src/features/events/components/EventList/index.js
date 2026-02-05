import React, { useState } from 'react';
import { COLORS } from '../../../../shared/theme/colors.ts';

const EventList = ({
  events,
  loading,
  meta,
  page,
  setPage,
  onEdit,
  onDelete,
  onViewRegistrations,
  onAddEvent
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleDeleteConfirm = (id) => {
    setShowDeleteModal(id);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(null);
  };

  const handleDeleteAccept = () => {
    if (showDeleteModal) {
      onDelete(showDeleteModal);
      setShowDeleteModal(null);
    }
  };

  const toggleDropdown = (eventId) => {
    setOpenDropdown(openDropdown === eventId ? null : eventId);
  };

  const handleViewRegistrationsClick = (event) => {
    onViewRegistrations(event);
  };

  const handleEditClick = (event) => {
    onEdit(event);
  };

  // Import EventTypesOptions at the top (add after the existing import)
  // Since we can't modify the import, I'll define a mapping function instead

  // Function to get Spanish label for type
  const getEventTypeLabel = (type) => {
    switch (type) {
      case 'SOCIAL':
        return 'Social';
      case 'SPORT':
        return 'Deporte';
      case 'FAMILY':
        return 'Familiar';
      case 'OTHER':
        return 'Otro';
      default:
        return type;
    }
  };

  // Function to get event type color
  const getEventTypeColor = (type) => {
    switch (type) {
      case 'SOCIAL':
        return 'bg-blue-100 text-blue-800';
      case 'SPORT':
        return 'bg-green-100 text-green-800';
      case 'FAMILY':
        return 'bg-purple-100 text-purple-800';
      case 'OTHER':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to format date with time - using the exact time from the ISO string
  const formatDate = (dateStr) => {
    if (!dateStr) return 'No especificada';
    try {
      // Parse the ISO string to extract exact date and time
      const date = new Date(dateStr);

      // Extract date part in local format
      const datePart = date.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      // Extract the time part from the ISO string (before timezone conversion)
      // ISO format is YYYY-MM-DDTHH:mm:ss.sssZ
      const timeMatch = dateStr.match(/T(\d{2}:\d{2}):\d{2}/);
      const timePart = timeMatch ? timeMatch[1] : date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });

      return `${datePart} a las ${timePart} hrs.`;
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const hasEvents = events && events.length > 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Lista de eventos</h2>
        <button
          onClick={onAddEvent}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Agregar evento
        </button>
      </div>
      
      {!hasEvents ? (
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-1">No se encontraron eventos</h3>
          <p className="text-gray-800 mb-6">No hay eventos registrados.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    {/* Event Image */}
                    {event.image && (
                      <div className="shrink-0">
                        <img
                          src={event.image}
                          alt={event.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{event.name}</h3>
                      {event.description && (
                        <p className="text-gray-600 text-sm mb-1">{event.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <div className="flex items-center mr-4">
                      <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(event.dateISO)}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1 rounded-md text-xs font-medium ${getEventTypeColor(event.type)}`}>
                      {getEventTypeLabel(event.type)}
                    </span>
                    <div className="flex gap-1">
                      <span className="text-xs text-gray-500">Total: </span>
                      <span className="text-xs font-medium text-gray-700">{event.totalSpots}</span>
                      <span className="text-xs text-gray-500 ml-2">Ocupados: </span>
                      <span className="text-xs font-medium text-gray-700">{event.totalSpots - event.availableSpots}</span>
                      <span className="text-xs text-gray-500 ml-2">Disponibles: </span>
                      <span className={`text-xs font-medium ${event.availableSpots > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {event.availableSpots}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(event.id)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                  {openDropdown === event.id && (
                    <div className="origin-bottom-right absolute right-0 bottom-full mb-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                      <div className="py-1" role="menu">
                        <button
                          onClick={() => {
                            handleEditClick(event);
                            setOpenDropdown(null);
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          role="menuitem"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            handleViewRegistrationsClick(event);
                            setOpenDropdown(null);
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          role="menuitem"
                        >
                          Ver registros
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteConfirm(event.id);
                            setOpenDropdown(null);
                          }}
                          className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                          role="menuitem"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          {/* Previous button */}
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-3 py-1 rounded border text-sm ${
              page === 1 ? 'text-gray-300 border-gray-200' : 'text-primary border-primary'
            }`}
          >
            Anterior
          </button>

          {/* Page number buttons */}
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-3 py-1 rounded border text-sm ${
                page === num ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-700'
              }`}
            >
              {num}
            </button>
          ))}

          {/* Next button */}
          <button
            disabled={page === meta.totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-3 py-1 rounded border text-sm ${
              page === meta.totalPages ? 'text-gray-300 border-gray-200' : 'text-primary border-primary'
            }`}
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">¿Estás seguro?</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Esta acción eliminará el evento permanentemente. ¿Deseas continuar?
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 mr-2"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteAccept}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 ml-2"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventList;