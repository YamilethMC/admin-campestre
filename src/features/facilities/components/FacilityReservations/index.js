import React, { useState, useEffect, useRef } from 'react';
import { useFacilities } from '../../hooks/useFacilities';

const FacilityReservations = ({ facility, onBack }) => {
  const searchTimeoutRef = useRef(null);
  // State for member search modal
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null); // {startTime, endTime}
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [memberLoading, setMemberLoading] = useState(false);

  // State for cancel reservation modal
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState(null);

  // State for delete reservation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);

  // Date state
  const [selectedDate, setSelectedDate] = useState(() => {
    // Use facility.selectedDate if available, otherwise use current date
    const initialDate = facility?.selectedDate || new Date().toISOString().split('T')[0];
    return initialDate;
  });

  const {
    getFacilityWithReservations,
    deleteReservation,
    createFacilityReservation,
    updateFacilityReservation,
    searchClubMembers // Need to get this from the hook
  } = useFacilities();

  const [facilityData, setFacilityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFacilityWithReservations();
  }, [facility.id, selectedDate]);

  const loadFacilityWithReservations = async () => {
    setLoading(true);
    setError(null);

    const data = await getFacilityWithReservations(facility.id, selectedDate);
    if (data) {
      setFacilityData(data);
    } else {
      setError('No se pudo cargar la instalación');
    }
    setLoading(false);
  };

  const handleDeleteReservation = async () => {
    if (!reservationToDelete) return;
    await deleteReservation(facility.id, reservationToDelete.id);

    // Reload the facility data
    loadFacilityWithReservations();

    setShowDeleteModal(false);
    setReservationToDelete(null);
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

  // Missing functions that were referenced in the JSX
  const openMemberSelection = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setSelectedMember(null); // Reset selected member
    setMemberSearchTerm('');
    searchMembers(''); // Load all members initially
    setShowMemberModal(true);
  };

  const openCancelReservationModal = (reservation) => {
    setReservationToCancel(reservation);
    setShowCancelModal(true);
  };

  // Search club members function
  const searchMembers = async (searchTerm = '') => {
    setMemberLoading(true);
    const result = await searchClubMembers(searchTerm);
    setMembers(result || []); // The hook already returns the members array
    setMemberLoading(false);
  };

  const handleMemberSearchChange = (value) => {
    setMemberSearchTerm(value);
    // Perform search after a delay to avoid too many API calls
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      searchMembers(value);
    }, 300);
  };

  const handleMemberSelect = (member) => {
    setSelectedMember(member);
  };

  const handleBookReservation = async () => {
    if (!selectedMember || !selectedTimeSlot) return; // Don't proceed if no member or time slot is selected

    // Prepare reservation data
    const reservationData = {
      startTime: `${selectedDate}T${selectedTimeSlot.startTime}Z`,
      endTime: `${selectedDate}T${selectedTimeSlot.endTime}Z`
    };
    
    // Create reservation
    const result = await createFacilityReservation(facility.id, selectedMember.id, reservationData);

    if (result) {
      // Reload the facility data to show updated reservations
      loadFacilityWithReservations();
      setShowMemberModal(false);
      setSelectedMember(null);
      setMembers([]);
      setSelectedTimeSlot(null);
    }
  };

  const handleCancelCancel = () => {
    setShowCancelModal(false);
    setReservationToCancel(null);
  };

  // Handle canceling reservation
  const handleCancelReservation = async () => {
    if (!reservationToCancel) return;

    // Prepare cancellation data
    const cancellationData = {
      startTime: `${selectedDate}T${reservationToCancel.startTime}Z`,
      endTime: `${selectedDate}T${reservationToCancel.endTime}Z`,
      status: "CANCELLED"
    };
    // Update reservation to cancelled status
    const result = await updateFacilityReservation(
      facility.id,
      reservationToCancel.clubMember.id,
      cancellationData
    );

    if (result) {
      // Reload the facility data to show updated reservations
      loadFacilityWithReservations();
    }

    setShowCancelModal(false);
    setReservationToCancel(null);
  };

  const handleConfirmCancel = () => {
    handleCancelReservation();
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
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <div>
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

            {/* Date Selection */}
            <div className="mt-4 flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Fecha:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Available Time Slots Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Horarios Disponibles</h2>
          {facilityData?.availableSlots && facilityData.availableSlots.length > 0 ? (
            <div className="grid grid-cols-7 gap-3">
              {facilityData.availableSlots.map((slot, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                >
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </div>
                  </div>

                  {/* Dropdown menu for available slots */}
                  <div className="mt-3 relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openMemberSelection(slot);
                      }}
                      className="w-full text-sm bg-primary hover:bg-primary-dark text-white py-1 px-2 rounded-md transition-colors"
                    >
                      Reservar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay horarios disponibles en este momento.</p>
            </div>
          )}
        </div>

        {/* Reserved Time Slots Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Horarios Reservados</h2>
          {facilityData?.reservedSlots && facilityData?.reservedSlots.length > 0 ? (
            <div className="grid grid-cols-6 gap-3">
              {facilityData.reservedSlots.map((reservation, index) => (
                <div
                  key={reservation.id || index}
                  className="border border-gray-300 rounded-lg bg-gray-50 p-4 flex flex-col"
                >
                  <div className="flex-grow">
                    <div className="flex items-center mb-2">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm mr-2">
                        {reservation.clubMember.user.name.charAt(0)}{reservation.clubMember.user.lastName?.charAt(0) || ''}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-800">
                          {reservation.clubMember.user.name} {reservation.clubMember.user.lastName}
                        </span>
                        <span className="text-xs text-gray-600">
                          Código: {reservation.clubMember.memberCode}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                        Horario
                      </span>
                      <span className="text-sm font-bold text-gray-800 bg-blue-50 px-2 py-1 rounded">
                        {formatTime(reservation.startTime)} - {formatTime(reservation.endTime)}
                      </span>
                    </div>
                  </div>

                  {/* Cancel button */}
                  <div className="mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openCancelReservationModal(reservation);
                      }}
                      className="w-full text-xs bg-gray-500 hover:bg-gray-600 text-white py-1.5 px-2.5 rounded-md transition-colors"
                    >
                      Cancelar
                  </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay horarios reservados en este momento.</p>
            </div>
          )}
        </div>
      </div>

      {/* Member Selection Modal for Booking */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                  Reservar {facility.name} en un horario de {selectedTimeSlot?.startTime} - {selectedTimeSlot?.endTime}
                </h3>
              </div>

              {/* Search section */}
              <div className="mt-6 px-7">
                <div className="mb-4">
                  <label htmlFor="memberSearch" className="block text-sm font-medium text-gray-700 mb-1">
                    Buscar socio
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="memberSearch"
                      value={memberSearchTerm}
                      onChange={(e) => handleMemberSearchChange(e.target.value)}
                      placeholder="Buscar socio por nombre..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                {/* Members list */}
                {!memberLoading && (
                  <div className="border rounded-lg max-h-60 overflow-y-auto">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                          selectedMember?.id === member.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handleMemberSelect(member)}
                      >
                        <div className="flex items-center">
                          <span className="font-semibold">{member.memberCode || 'N/A'}</span>
                          <span className="ml-2">{member.user.name} {member.user.lastName}</span>
                        </div>
                      </div>
                    ))}
                    {members.length === 0 && !memberLoading && (
                      <div className="p-3 text-center text-gray-500">
                        No se encontraron socios
                      </div>
                    )}
                  </div>
                )}

                {memberLoading && (
                  <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>

              <div className="items-center px-4 py-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowMemberModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleBookReservation}
                  disabled={!selectedMember}
                  className={`px-4 py-2 text-white text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                    !selectedMember
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary hover:bg-primary-dark'
                  }`}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Reservation Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Confirmar cancelación</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  ¿Estás seguro que deseas cancelar esta reservación?
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {reservationToCancel &&
                    `${formatTime(reservationToCancel.startTime)} - ${formatTime(reservationToCancel.endTime)}`}
                </p>
                <p className="text-sm text-gray-600">
                  {reservationToCancel?.clubMember?.user?.name} {reservationToCancel?.clubMember?.user?.lastName}
                </p>
              </div>
              <div className="flex justify-center space-x-3 px-4 py-3">
                <button
                  onClick={handleCancelCancel}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Confirmar eliminación</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  ¿Estás seguro que deseas eliminar esta reservación?
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {reservationToDelete &&
                    `${formatTime(reservationToDelete.startTime)} - ${formatTime(reservationToDelete.endTime)}`}
                </p>
                <p className="text-sm text-gray-600">
                  {reservationToDelete?.clubMember?.user?.name} {reservationToDelete?.clubMember?.user?.lastName}
                </p>
              </div>
              <div className="flex justify-center space-x-3 px-4 py-3">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
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

export default FacilityReservations;