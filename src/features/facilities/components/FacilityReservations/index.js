import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../../../shared/context/AppContext';
import { facilityService } from '../../services';

const FacilityReservations = ({ facility, onBack }) => {
  const [facilityData, setFacilityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);

  const { toasts, setToasts } = useContext(AppContext);

  useEffect(() => {
    loadFacilityWithReservations();
  }, [facility.id]);

  const loadFacilityWithReservations = async () => {
    try {
      setLoading(true);
      const data = await facilityService.getFacilityById(facility.id);
      setFacilityData(data);
    } catch (err) {
      setError(err.message || 'Error al cargar las reservaciones');
      setToasts(prev => [...prev, {
        id: Date.now(),
        message: err.message || 'Error al cargar las reservaciones',
        type: 'error'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReservation = async () => {
    if (!reservationToDelete) return;

    try {
      // Placeholder for deleting reservation
      // In the future, implement the actual API call for deleting a specific reservation
      console.log('Deleting reservation:', reservationToDelete);
      
      // Show success toast
      setToasts(prev => [...prev, {
        id: Date.now(),
        message: 'Reservación eliminada exitosamente',
        type: 'success'
      }]);
      
      // Reload the facility data
      loadFacilityWithReservations();
    } catch (err) {
      setToasts(prev => [...prev, {
        id: Date.now(),
        message: err.message || 'Error al eliminar la reservación',
        type: 'error'
      }]);
    } finally {
      setShowDeleteModal(false);
      setReservationToDelete(null);
    }
  };

  const confirmDeleteReservation = (reservation) => {
    setReservationToDelete(reservation);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    handleDeleteReservation();
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setReservationToDelete(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    // Handle both "HH:MM:SS" and ISO format
    if (timeString.includes('T')) {
      return new Date(timeString).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }
    return timeString.substring(0, 5); // "HH:MM"
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        {/* Header with back button */}
        <div className="flex items-start space-x-4 mb-6">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 mt-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">{facilityData?.name || facility?.name}</h1>
            {facilityData?.description && (
              <p className="text-gray-600 mt-2">{facilityData.description}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                {facilityData?.type === 'PADEL' ? 'Padel' :
                 facilityData?.type === 'TENNIS' ? 'Tennis' :
                 facilityData?.type === 'GYM' ? 'Gimnasio' : 'Otro'}
              </span>
              {facilityData?.openTime && (
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Abre: {formatTime(facilityData.openTime)}
                </div>
              )}
              {facilityData?.closeTime && (
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Cierra: {formatTime(facilityData.closeTime)}
                </div>
              )}
              {facilityData?.maxDuration && (
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Máx: {facilityData.maxDuration} min
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Available Time Slots Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Reservaciones</h2>
          {facilityData?.availableSlots && facilityData.availableSlots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {facilityData.availableSlots.map((slot, index) => (
                <div 
                  key={index} 
                  className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                >
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </div>
                  </div>
                  <button
                    onClick={() => confirmDeleteReservation(slot)}
                    className="mt-3 w-full text-sm text-red-600 hover:text-red-800 hover:bg-red-50 py-1 px-2 rounded-md transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay horarios disponibles en este momento.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmar eliminación</h3>
            <p className="text-gray-600 mb-4">
              ¿Estás seguro que deseas eliminar esta reservación?
            </p>
            <p className="text-gray-600 text-sm mb-4">
              {reservationToDelete && 
                `${formatTime(reservationToDelete.startTime)} - ${formatTime(reservationToDelete.endTime)}`
              }
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                onClick={handleCancelDelete}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                onClick={handleConfirmDelete}
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

export default FacilityReservations;