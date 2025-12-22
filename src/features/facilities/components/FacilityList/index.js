import React, { useState } from 'react';

const FacilityList = ({
  facilities,
  loading,
  meta,
  page,
  setPage,
  onEdit,
  onDelete,
  onViewReservations,
  onAddFacility,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't return early, instead handle no facilities inside the main return

  const formatTime = timeString => {
    // Handle both "HH:MM:SS" and ISO format
    if (timeString.includes('T')) {
      return new Date(timeString).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return timeString.substring(0, 5); // "HH:MM"
  };

  const getStatusColor = status => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800';
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Lista de instalaciones</h2>
        <button
          onClick={onAddFacility}
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
          Agregar instalación
        </button>
      </div>

      {facilities.length > 0 ? (
        <div className="space-y-4">
          {facilities.map(facility => (
            <div
              key={facility.id}
              className="bg-white p-6 rounded-lg shadow border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{facility.name}</h3>
                  </div>

                  {facility.description && (
                    <p className="text-gray-600 text-sm mb-2">{facility.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
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
                      <span>Abre: {formatTime(facility.openTime)}</span>
                    </div>

                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
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
                      <span>Cierra: {formatTime(facility.closeTime)}</span>
                    </div>

                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
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
                      <span>Máx: {facility.maxDuration} min</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(facility.status)}`}
                    >
                      {facility.status === 'ACTIVE'
                        ? 'Activo'
                        : facility.status === 'INACTIVE'
                          ? 'Inactivo'
                          : 'En mantenimiento'}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {facility.type === 'PADEL'
                        ? 'Padel'
                        : facility.type === 'TENNIS'
                          ? 'Tennis'
                          : facility.type === 'GYM'
                            ? 'Gimnasio'
                            : 'Otro'}
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={() =>
                      setDropdownOpen(dropdownOpen === facility.id ? null : facility.id)
                    }
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                  {dropdownOpen === facility.id && (
                    <div className="origin-bottom-right absolute right-0 bottom-full mb-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                      <div className="py-1" role="menu">
                        <button
                          onClick={() => {
                            onEdit(facility);
                            setDropdownOpen(null);
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          role="menuitem"
                        >
                          Editar
                        </button>
                        {facility.status === 'ACTIVE' && (
                          <button
                            onClick={() => {
                              onViewReservations(facility);
                              setDropdownOpen(null);
                            }}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            role="menuitem"
                          >
                            Ver reservaciones
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setFacilityToDelete(facility);
                            setShowDeleteModal(true);
                            setDropdownOpen(null);
                          }}
                          className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
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
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No se encontraron instalaciones
          </h3>
          <p className="text-gray-500 mb-6">No hay instalaciones registradas.</p>
        </div>
      )}

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
                page === num
                  ? 'bg-primary text-white border-primary'
                  : 'border-gray-300 text-gray-700'
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
              page === meta.totalPages
                ? 'text-gray-300 border-gray-200'
                : 'text-primary border-primary'
            }`}
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && facilityToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmar eliminación</h3>
            <p className="text-gray-600 mb-4">
              ¿Estás seguro que deseas eliminar la instalación "{facilityToDelete.name}"? Esta
              acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                onClick={() => {
                  setShowDeleteModal(false);
                  setFacilityToDelete(null);
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                onClick={() => {
                  onDelete(facilityToDelete.id);
                  setShowDeleteModal(false);
                  setFacilityToDelete(null);
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilityList;
