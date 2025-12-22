import React, { useState, useEffect, useRef } from 'react';

const EventRegistrations = ({
  event,
  registrations = [],
  onBack,
  onUpdateRegistration,
  onDeleteRegistration,
  onRefreshEvent,
  createEventRegistration,
  getClubMemberById,
  searchClubMembers,
}) => {
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  // Function to open the add member modal and fetch initial members
  const handleViewMembers = () => {
    // Clear any pending search timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setShowAddMemberModal(true);
    // Reset selected member and other states when modal opens
    setSelectedMember(null);
    setSelectedGuests([]);
    setMemberGuests([]);
    setIsMemberSelected(false); // Default to not having the member selected
    setExpandedMemberId(null); // Reset expanded member state
    setSearchTerm('');
    // Fetch initial members when modal opens
    fetchMembers('');
  };
  const [showUpdateModal, setShowUpdateModal] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [updatedRegistrationsCount, setUpdatedRegistrationsCount] = useState(0);

  // New state variables for member selection
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberGuests, setMemberGuests] = useState([]);
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [isMemberSelected, setIsMemberSelected] = useState(false); // Whether the member themselves is selected (default to false)
  const [expandedMemberId, setExpandedMemberId] = useState(null); // Track which member ID is expanded in the list
  const searchTimeoutRef = useRef(null); // For debouncing search requests
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [registrationToSubmit, setRegistrationToSubmit] = useState(null);

  const toggleDropdown = id => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  // Function to fetch members using the hook function
  const fetchMembers = async (search = '') => {
    setLoadingMembers(true);
    const result = await searchClubMembers(search);
    setMembers(result);
    setLoadingMembers(false);
    return result;
  };

  // Handle member selection with expandable functionality
  const handleMemberSelect = async member => {
    // If clicking on an already expanded member, collapse it
    if (expandedMemberId === member.id) {
      // Collapse the member
      setExpandedMemberId(null);
      setSelectedMember(null);
      setSelectedGuests([]);
      setMemberGuests([]);
      setIsMemberSelected(false);
    } else {
      // Expand this member and load their guests
      setExpandedMemberId(member.id);
      setSelectedMember(member);
      setSelectedGuests([]); // Reset selected guests when selecting a new member
      setIsMemberSelected(false); // Default to not having the member selected

      try {
        const memberDetails = await getClubMemberById(member.id);
        if (memberDetails) {
          setMemberGuests(memberDetails.guests || []);
        } else {
          setMemberGuests([]);
        }
      } catch (error) {
        // The error will be handled by the hook and already shown as a toast
        setMemberGuests([]);
      }
    }
  };

  // Handle search input change - update the local state
  const handleSearchChange = value => {
    setSearchTerm(value);
  };

  // Function to handle search when user presses enter or clicks search button
  const handleSearch = async e => {
    e?.preventDefault();
    fetchMembers(searchTerm);
  };

  // Handle guest selection
  const handleGuestSelect = (guestId, checked) => {
    if (checked) {
      setSelectedGuests(prev => [...prev, guestId]);
    } else {
      setSelectedGuests(prev => prev.filter(id => id !== guestId));
    }
  };

  // Handle member selection (for the main member checkbox)
  const handleMemberCheckboxSelect = checked => {
    setIsMemberSelected(checked);
  };

  // Handle saving registration
  const handleSaveRegistration = () => {
    if (!selectedMember) return;

    // The total registrations is the member (if selected) + number of selected guests
    const totalRegistrations = (isMemberSelected ? 1 : 0) + selectedGuests.length;

    // We need at least one registration (member or guest)
    if (totalRegistrations === 0) {
      // Optionally show an error message here
      return;
    }

    // Prepare the data to submit
    const registrationData = {
      clubMemberId: selectedMember.id,
      totalRegistrations,
    };

    setRegistrationToSubmit(registrationData);
    setShowConfirmationModal(true);
  };

  // Confirm registration
  const confirmRegistration = async () => {
    if (!registrationToSubmit) return;

    try {
      const result = await createEventRegistration(event.id, registrationToSubmit);
      if (result) {
        // Refresh the event data to show new registration
        if (onRefreshEvent) {
          await onRefreshEvent(event.id);
        }
        // Clear any pending search timeout
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
        // Close the modal
        setShowAddMemberModal(false);
        // Reset states
        setSelectedMember(null);
        setSelectedGuests([]);
        setMemberGuests([]);
        setIsMemberSelected(false);
        setExpandedMemberId(null);
        setSearchTerm('');
        setRegistrationToSubmit(null);
      }
    } catch (error) {
      // The error will be handled by the hook and already shown as a toast
    } finally {
      setShowConfirmationModal(false);
    }
  };

  // Calculate event statistics
  const totalSpots = event?.totalSpots || 0;
  const ocupedSpots = registrations.reduce((sum, reg) => sum + (reg.totalRegistrations || 0), 0);
  const availableSpots = Math.max(0, totalSpots - ocupedSpots);

  const handleAddMemberAccept = () => {
    // Clear any pending search timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    setShowAddMemberModal(false);
  };

  const handleUpdateRegistrations = registration => {
    setShowUpdateModal(registration);
    setUpdatedRegistrationsCount(registration.totalRegistrations);
  };

  const handleUpdateConfirm = async () => {
    if (showUpdateModal && onUpdateRegistration) {
      try {
        const result = await onUpdateRegistration(event.id, showUpdateModal.clubMemberId, {
          totalRegistrations: updatedRegistrationsCount,
        });
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
    if (
      showUpdateModal &&
      updatedRegistrationsCount < availableSpots + showUpdateModal.totalRegistrations
    ) {
      setUpdatedRegistrationsCount(prev => prev + 1);
    }
  };

  const decrementRegistration = () => {
    if (showUpdateModal && updatedRegistrationsCount > 1) {
      setUpdatedRegistrationsCount(prev => prev - 1);
    }
  };

  const handleDeleteRegistration = registrationId => {
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
  const formatDate = dateStr => {
    if (!dateStr) return 'No especificada';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 text-gray-600 hover:text-gray-900">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{event?.name}</h1>
          <p className="text-gray-600">{event?.description}</p>
        </div>
      </div>

      {/* Event Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Date Card */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-700">Fecha</h3>
              <p className="text-lg font-semibold text-gray-900">{formatDate(event?.date)}</p>
            </div>
          </div>
        </div>

        {/* Location Card */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-purple-700">Lugar</h3>
              <p className="text-lg font-semibold text-gray-900">{event?.location || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Spots Card */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <h3 className="text-sm font-medium text-green-700 mb-2">Lugares</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-xs text-green-600">Total</p>
              <p className="text-lg font-bold text-gray-900">{event?.totalSpots || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-green-600">Disponibles</p>
              <p
                className={`text-lg font-bold ${availableSpots > 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {availableSpots}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-green-600">Ocupados</p>
              <p className="text-lg font-bold text-gray-900">{ocupedSpots}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Registros</h2>
        <div className="flex space-x-3">
          <button
            onClick={handleViewMembers}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Agregar socio
          </button>
          <button
            onClick={() => alert('Funcionalidad de ver lista no implementada aún')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Ver lista
          </button>
        </div>
      </div>

      {registrations.length > 0 ? (
        <div className="bg-white shadow-lg rounded-lg">
          <ul className="divide-y divide-gray-200">
            {registrations.map(registration => (
              <li key={registration.id} className="hover:bg-gray-50 transition-colors duration-150">
                <div className="block">
                  <div className="flex items-center px-6 py-5">
                    <div className="min-w-0 flex-1 flex items-center">
                      <div className="min-w-0 flex-1 md:grid md:grid-cols-2 gap-6">
                        <div>
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                              {registration.clubMember.user.name.charAt(0)}
                              {registration.clubMember.user.lastName?.charAt(0) || ''}
                            </div>
                            <div className="ml-4">
                              <p className="text-base font-bold text-gray-900">
                                {registration.clubMember.user.name}{' '}
                                {registration.clubMember.user.lastName}
                              </p>
                              <p className="text-sm text-gray-500">
                                <span className="font-medium">Código:</span>{' '}
                                {registration.clubMember.memberCode || 'N/A'}
                              </p>
                              <p className="text-sm text-gray-500 flex items-center mt-1">
                                <svg
                                  className="h-4 w-4 text-gray-400 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                  />
                                </svg>
                                {registration.clubMember.user.email}
                              </p>
                              <p className="text-sm text-gray-500 flex items-center mt-1">
                                <svg
                                  className="h-4 w-4 text-gray-400 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                Fecha:{' '}
                                {formatDate(registration.createdAt || registration.updatedAt)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end">
                          <div className="flex items-center bg-gradient-to-r from-green-50 to-green-100 rounded-lg px-4 py-2 mr-4">
                            <svg
                              className="h-5 w-5 text-green-600 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            <span className="text-lg font-bold text-gray-900">
                              {registration.totalRegistrations}
                            </span>
                            <span className="text-sm text-gray-600 ml-1">
                              registrado{registration.totalRegistrations !== 1 ? 's' : ''}
                            </span>
                          </div>

                          <div className="relative inline-block text-left">
                            <button
                              onClick={() => toggleDropdown(registration.id)}
                              className="inline-flex justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary items-center justify-center transition-colors duration-150"
                            >
                              <svg
                                className="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 6a2 2 0 110-4 2 2 0 010 4zM12 14a2 2 0 110-4 2 2 0 010 4zM12 22a2 2 0 110-4 2 2 0 010 4z"
                                />
                              </svg>
                            </button>
                            {openDropdown === registration.id && (
                              <div className="origin-bottom-right absolute right-0 bottom-full mb-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 border border-gray-200">
                                <div className="py-1" role="none">
                                  <button
                                    onClick={() => {
                                      handleUpdateRegistrations(registration);
                                      setOpenDropdown(null);
                                    }}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors duration-150"
                                  >
                                    <svg
                                      className="h-4 w-4 mr-2 text-blue-600"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                      />
                                    </svg>
                                    Actualizar número de inscripciones
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleDeleteRegistration(registration.id);
                                      setOpenDropdown(null);
                                    }}
                                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors duration-150"
                                  >
                                    <svg
                                      className="h-4 w-4 mr-2 text-red-600"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                    Eliminar
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="mt-2 text-lg font-medium text-gray-900">No hay registros</h3>
          <p className="mt-1 text-gray-500">Este evento aún no tiene registros de socios.</p>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Agregar socio</h3>
              </div>

              {/* Search section */}
              <div className="mt-6 px-7">
                <div className="mb-4">
                  <label
                    htmlFor="memberSearch"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Buscar socio
                  </label>
                  <input
                    type="text"
                    id="memberSearch"
                    value={searchTerm}
                    onChange={e => {
                      handleSearchChange(e.target.value);
                      // Automatically trigger search after a short delay to avoid too many API calls
                      clearTimeout(searchTimeoutRef.current);
                      searchTimeoutRef.current = setTimeout(() => {
                        fetchMembers(e.target.value);
                      }, 300); // 300ms delay
                    }}
                    placeholder="Buscar socio por nombre..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>

                {/* Members list with expandable guest selection */}
                {!loadingMembers && (
                  <div className="border rounded-lg max-h-60 overflow-y-auto">
                    {members.map(member => (
                      <React.Fragment key={member.id}>
                        <div
                          className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                            expandedMemberId === member.id ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => handleMemberSelect(member)}
                        >
                          <div className="flex items-center">
                            <span className="font-semibold">{member.memberCode || 'N/A'}</span>
                            <span className="ml-2">
                              {member.user.name} {member.user.lastName}
                            </span>
                          </div>
                        </div>

                        {/* Expanded guest selection for this specific member */}
                        {expandedMemberId === member.id && (
                          <div className="bg-gray-50 border-b pl-4 pr-4 pt-2 pb-2">
                            <div className="mb-3">
                              {/* Member with checkbox */}
                              <div className="mb-3 p-3 border rounded-md bg-white">
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={isMemberSelected}
                                    onChange={e => handleMemberCheckboxSelect(e.target.checked)}
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                  />
                                  <span className="ml-2">
                                    {member.user.name} {member.user.lastName} (Socio)
                                  </span>
                                </label>
                              </div>

                              {/* Guests list for this specific member */}
                              {memberGuests.length > 0 && (
                                <div className="space-y-2 ml-4">
                                  {memberGuests.map(guest => (
                                    <div key={guest.id} className="p-3 border rounded-md bg-white">
                                      <label className="flex items-center">
                                        <input
                                          type="checkbox"
                                          checked={selectedGuests.includes(guest.id)}
                                          onChange={e =>
                                            handleGuestSelect(guest.id, e.target.checked)
                                          }
                                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                        />
                                        <span className="ml-2">
                                          {guest.user.name} {guest.user.lastName}
                                        </span>
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                    {members.length === 0 && !loadingMembers && (
                      <div className="p-3 text-center text-gray-500">No se encontraron socios</div>
                    )}
                  </div>
                )}
              </div>

              <div className="items-center px-4 py-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveRegistration}
                  disabled={
                    !selectedMember || (isMemberSelected === false && selectedGuests.length === 0)
                  }
                  className={`px-4 py-2 text-white text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                    !selectedMember || (isMemberSelected === false && selectedGuests.length === 0)
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

      {/* Update Registration Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="px-6 pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Actualizar inscripciones</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Socio: {showUpdateModal.clubMember.user.name}{' '}
                    {showUpdateModal.clubMember.user.lastName}
                  </p>
                </div>
                <button
                  onClick={() => setShowUpdateModal(null)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="text-center">
                <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-blue-100 rounded-full px-4 py-2">
                  <svg
                    className="h-5 w-5 text-blue-600 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="text-2xl font-bold text-gray-900">
                    {updatedRegistrationsCount}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-2">Personas registradas actualmente</p>
              </div>

              <div className="mt-6 flex items-center justify-center">
                <button
                  type="button"
                  onClick={decrementRegistration}
                  disabled={updatedRegistrationsCount <= 1}
                  className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xl font-bold shadow-md transition-all duration-150 disabled:transform-none hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
                >
                  -
                </button>

                <div className="mx-6 text-center">
                  <p className="text-sm text-gray-500">Disponibles</p>
                  <p className="text-lg font-bold text-blue-600">
                    {availableSpots +
                      showUpdateModal.totalRegistrations -
                      updatedRegistrationsCount}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={incrementRegistration}
                  disabled={
                    updatedRegistrationsCount >= availableSpots + showUpdateModal.totalRegistrations
                  }
                  className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xl font-bold shadow-md transition-all duration-150 disabled:transform-none hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
              <button
                onClick={() => setShowUpdateModal(null)}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateConfirm}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md"
              >
                Guardar cambios
              </button>
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

      {/* Confirmation Modal for Registration */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                Confirmar registro
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  ¿Estás seguro de que deseas registrar a {registrationToSubmit?.totalRegistrations}{' '}
                  persona(s) para este evento?
                </p>
              </div>
              <div className="items-center px-4 py-3 flex justify-center space-x-3">
                <button
                  onClick={() => setShowConfirmationModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmRegistration}
                  className="px-4 py-2 bg-primary text-white text-base font-medium rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
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
