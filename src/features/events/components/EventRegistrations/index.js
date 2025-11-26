import React, { useState } from 'react';

const EventRegistrations = ({
  event,
  registrations = [],
  onBack,
  onUpdateRegistration,
  onDeleteRegistration,
  onRefreshEvent
}) => {
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [updatedRegistrationsCount, setUpdatedRegistrationsCount] = useState(0);

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  // Calculate event statistics
  const totalSpots = event?.totalSpots || 0;
  const ocupedSpots = registrations.reduce((sum, reg) => sum + (reg.totalRegistrations || 0), 0);
  const availableSpots = Math.max(0, totalSpots - ocupedSpots);

  const handleViewMembers = () => {
    setShowAddMemberModal(true);
  };

  const handleAddMemberAccept = () => {
    setShowAddMemberModal(false);
  };

  const handleUpdateRegistrations = (registration) => {
    setShowUpdateModal(registration);
    setUpdatedRegistrationsCount(registration.totalRegistrations);
  };

  const handleUpdateConfirm = async () => {
    if (showUpdateModal && onUpdateRegistration) {
      try {
        const result = await onUpdateRegistration(
          event.id,
          showUpdateModal.clubMemberId,
          { totalRegistrations: updatedRegistrationsCount }
        );
        if (result) {
          if (onRefreshEvent) {
            await onRefreshEvent(event.id);
          }
        }
      } catch (error) {
        // Error is handled in the service
      }
    }
    setShowUpdateModal(null);
  };

  const incrementRegistration = () => {
    if (showUpdateModal && updatedRegistrationsCount < availableSpots + showUpdateModal.totalRegistrations) {
      setUpdatedRegistrationsCount(prev => prev + 1);
    }
  };

  const decrementRegistration = () => {
    if (showUpdateModal && updatedRegistrationsCount > 1) {
      setUpdatedRegistrationsCount(prev => prev - 1);
    }
  };

  const handleDeleteRegistration = (registrationId) => {
    setShowDeleteModal(registrationId);
  };

  const handleDeleteConfirm = async () => {
    if (showDeleteModal && onDeleteRegistration) {
      try {
        // Find the registration to get the member ID
        const registrationToDelete = registrations.find(reg => reg.id === showDeleteModal);
        if (registrationToDelete) {
          const result = await onDeleteRegistration(event.id, registrationToDelete.clubMemberId);
          if (result) {
            if (onRefreshEvent) {
              await onRefreshEvent(event.id);
            }
          }
        }
      } catch (error) {
        // Error is handled in the service
      }
    }
    setShowDeleteModal(null);
  };

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return 'No especificada';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{event?.name}</h1>
          <p className="text-gray-600">{event?.description}</p>
        </div>
      </div>

      {/* Event Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">Tipo</h3>
          <p className="text-lg font-semibold text-gray-900">{event?.type || 'N/A'}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">Total de lugares</h3>
          <p className="text-lg font-semibold text-gray-900">{event?.totalSpots || 0}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">Disponibles</h3>
          <p className={`text-lg font-semibold ${availableSpots > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {availableSpots}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">Ocupados</h3>
          <p className="text-lg font-semibold text-gray-900">{ocupedSpots}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">Fecha</h3>
          <p className="text-lg font-semibold text-gray-900">{formatDate(event?.dateISO)}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">Lugar</h3>
          <p className="text-lg font-semibold text-gray-900">{event?.location || 'N/A'}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Registros</h2>
        <button
          onClick={handleViewMembers}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Agregar socio
        </button>
      </div>

      {registrations.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Socio ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registros
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {registrations.map((registration) => (
                <tr key={registration.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{registration.clubMemberId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Nombre del socio</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">SOCIO-{registration.clubMemberId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{registration.totalRegistrations}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative inline-block text-left">
                      <button
                        onClick={() => toggleDropdown(registration.id)}
                        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6a2 2 0 110-4 2 2 0 010 4zM12 14a2 2 0 110-4 2 2 0 010 4zM12 22a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      {openDropdown === registration.id && (
                        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1" role="none">
                            <button
                              onClick={() => {
                                handleUpdateRegistrations(registration);
                                setOpenDropdown(null);
                              }}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                              Actualizar número de inscripciones
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteRegistration(registration.id);
                                setOpenDropdown(null);
                              }}
                              className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay registros</h3>
          <p className="mt-1 text-sm text-gray-500">
            Este evento aún no tiene registros de socios.
          </p>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Agregar socio</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Funcionalidad pendiente
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Registration Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                Número de inscripciones para el socio {showUpdateModal.clubMemberId}
              </h3>
              <div className="mt-2 px-7 py-3">
                <div className="flex items-center justify-center space-x-4">
                  <button
                    type="button"
                    onClick={decrementRegistration}
                    className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={updatedRegistrationsCount <= 1}
                  >
                    -
                  </button>
                  <span className="text-xl font-bold min-w-[40px] text-center">
                    {updatedRegistrationsCount}
                  </span>
                  <button
                    type="button"
                    onClick={incrementRegistration}
                    className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={updatedRegistrationsCount >= availableSpots + showUpdateModal.totalRegistrations}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setShowUpdateModal(null)}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 mr-2"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdateConfirm}
                  className="px-4 py-2 bg-primary text-white text-base font-medium rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary ml-2"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Registration Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">¿Estás seguro?</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Esta acción eliminará el registro del socio. ¿Deseas continuar?
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 mr-2"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteConfirm}
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

export default EventRegistrations;