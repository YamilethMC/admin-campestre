import React, { useState, useContext } from 'react';
import { AppContext } from '../../../shared/context/AppContext';
import FacilityHeader from '../components/FacilityHeader';
import FacilityFilters from '../components/FacilityFilters';
import FacilityList from '../components/FacilityList';
import FacilityForm from '../components/FacilityForm';
import FacilityReservations from '../components/FacilityReservations';
import { useFacilities } from '../hooks/useFacilities';
import { facilityService } from '../services';

const FacilitiesContainer = () => {
  const [view, setView] = useState('list'); // 'list', 'form', or 'reservations'
  const [currentFacility, setCurrentFacility] = useState(null);

  const {
    facilities,
    loading,
    error,
    meta,
    page,
    setPage,
    search,
    setSearch,
    status,
    setStatus,
    type,
    setType,
    date,
    setDate,
    loadFacilities,
    resetFilters,
    getFacilityById,
    createFacility,
    updateFacility,
    deleteFacility,
  } = useFacilities();

  // Update filters
  const updateFilters = newFilters => {
    if (newFilters.status !== undefined) {
      setStatus(newFilters.status);
      setPage(1);
    }
    if (newFilters.type !== undefined) {
      setType(newFilters.type);
      setPage(1);
    }
    if (newFilters.search !== undefined) {
      setSearch(newFilters.search);
      setPage(1);
    }
  };

  const handleDateChange = newDate => {
    setDate(newDate);
    setPage(1);
  };

  // Handle adding a new facility
  const handleAddFacility = () => {
    setCurrentFacility(null);
    setView('form');
  };

  // Handle editing a facility
  const handleEditFacility = async facility => {
    // Load the full facility data
    const fullFacility = await getFacilityById(facility.id);
    if (fullFacility) {
      setCurrentFacility(fullFacility);
      setView('form');
    }
  };

  // Handle viewing reservations
  const handleViewReservations = facility => {
    // Create a new facility object with the current date set
    const facilityWithDate = {
      ...facility,
      selectedDate: new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
    };
    setCurrentFacility(facilityWithDate);
    setView('reservations');
  };

  // Handle saving a facility (create or update)
  const handleSaveFacility = async facilityData => {
    if (currentFacility) {
      // Update existing facility
      await updateFacility(currentFacility.id, facilityData);
    } else {
      // Create new facility
      await createFacility(facilityData);
    }
    setView('list');
    resetFiltersToDefaults(); // Reset filters when returning to list
    loadFacilities(); // Reload list
  };

  // Handle canceling form
  const handleCancelForm = () => {
    setView('list');
    setCurrentFacility(null);
    resetFiltersToDefaults(); // Reset filters when returning to list
  };

  // Handle going back from reservations view
  const handleBackFromReservations = () => {
    setView('list');
    setCurrentFacility(null);
    resetFiltersToDefaults(); // Reset filters when returning to list
  };

  // Handle deleting a facility
  const handleDeleteFacility = async id => {
    const success = await deleteFacility(id);
    if (success) {
      // If the list is empty and we're not on page 1, go back a page
      if (facilities.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        loadFacilities();
      }
    }
  };

  // Reset filters to defaults when returning to list
  const resetFiltersToDefaults = () => {
    setSearch('');
    setDate('');
    setType('');
    setStatus('ACTIVE'); // Default to active
  };

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  // Form view
  if (view === 'form') {
    return (
      <FacilityForm
        facility={currentFacility}
        onSave={handleSaveFacility}
        onCancel={handleCancelForm}
      />
    );
  }

  // Reservations view
  if (view === 'reservations') {
    return <FacilityReservations facility={currentFacility} onBack={handleBackFromReservations} />;
  }

  // List view
  return (
    <div>
      <FacilityHeader />

      <FacilityFilters
        filters={{ status, type, search, date }}
        onFilterChange={updateFilters}
        onDateChange={handleDateChange}
      />

      <FacilityList
        facilities={facilities}
        loading={loading}
        meta={meta}
        page={page}
        setPage={setPage}
        onEdit={handleEditFacility}
        onDelete={handleDeleteFacility}
        onViewReservations={handleViewReservations}
        onAddFacility={handleAddFacility}
      />
    </div>
  );
};

export default FacilitiesContainer;
