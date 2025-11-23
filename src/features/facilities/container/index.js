
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

  const { addToast } = useContext(AppContext);

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
    resetFilters
  } = useFacilities();

  // Update filters
  const updateFilters = (newFilters) => {
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

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setPage(1);
  };

  // Handle adding a new facility
  const handleAddFacility = () => {
    setCurrentFacility(null);
    setView('form');
  };

  // Handle editing a facility
  const handleEditFacility = async (facility) => {
    try {
      // Load the full facility data
      const fullFacility = await loadFacility(facility.id, addToast);
      setCurrentFacility(fullFacility);
      setView('form');
    } catch (err) {
      // Error is handled in the loadFacility function
    }
  };

  // Handle viewing reservations
  const handleViewReservations = (facility) => {
    setCurrentFacility(facility);
    setView('reservations');
  };

  // Handle saving a facility (create or update)
  const handleSaveFacility = async (facilityData) => {
    try {
      if (currentFacility) {
        // Update existing facility
        await updateFacility(currentFacility.id, facilityData, addToast);
      } else {
        // Create new facility
        await createFacility(facilityData, addToast);
      }
      setView('list');
      resetFiltersToDefaults(); // Reset filters when returning to list
      loadFacilities(); // Reload list
    } catch (err) {
      // Error is handled in the create/update functions
    }
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
  const handleDeleteFacility = async (id) => {
    try {
      await deleteFacility(id, addToast);
      // If the list is empty and we're not on page 1, go back a page
      if (facilities.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        loadFacilities();
      }
    } catch (err) {
      // Error is handled in the deleteFacility function
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
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
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
    return (
      <FacilityReservations
        facility={currentFacility}
        onBack={handleBackFromReservations}
      />
    );
  }

  // List view
  return (
    <div className="max-w-7xl mx-auto">
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

// Separate functions for API calls to handle errors properly
const loadFacility = async (id, addToast) => {
  const result = await facilityService.getFacilityById(id);

  if (result.success) {
    return result.data;
  } else {
    addToast(result.error || 'Error al cargar la instalación', 'error');
    return;
  }
};

const createFacility = async (facilityData, addToast) => {
  const result = await facilityService.createFacility(facilityData);

  if (result.success) {
    addToast(result.message || 'Instalación creada exitosamente', 'success');
    return result.data;
  } else {
    addToast(result.error || 'Error al crear instalación', 'error');
    return;
  }
};

const updateFacility = async (id, facilityData, addToast) => {
  const result = await facilityService.updateFacility(id, facilityData);

  if (result.success) {
    return result.data;
  } else {
    addToast(result.error || 'Error al actualizar instalación', 'error');
    return;
  }
};

const deleteFacility = async (id, addToast) => {
  const result = await facilityService.deleteFacility(id);

  if (result.success) {
    return result;
  } else {
    addToast(result.error || 'Error al eliminar instalación', 'error');
    return;
  }
};

export default FacilitiesContainer;