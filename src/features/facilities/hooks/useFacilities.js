import { useEffect, useState, useContext } from 'react';
import { facilityService } from '../services';
import { AppContext } from '../../../shared/context/AppContext';

export function useFacilities(initialFilters = {}) {
  const { addToast } = useContext(AppContext);
  const [facilities, setFacilities] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');

  const loadFacilities = async (filters = {}) => {
    setLoading(true);
    const response = await facilityService.fetchFacilities({
      page: filters.page !== undefined ? filters.page : page,
      limit: 10, // Fixed limit as requested
      search: filters.search !== undefined ? filters.search : search,
      status: filters.status !== undefined ? filters.status : status,
      type: filters.type !== undefined ? filters.type : type,
      date: filters.date !== undefined ? filters.date : date,
      order: 'asc', // Fixed as requested
      orderBy: 'name', // Fixed as requested
    });

    if (response.success) {
      setFacilities(response.data.data);
      setMeta(response.data.meta);
    } else {
      addToast(response.error || 'Error al cargar instalaciones', 'error');
      return;
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFacilities({ page, search, status, type, date });
  }, [page, search, status, type, date]);

  // Reset filters to default values
  const resetFilters = () => {
    setSearch('');
    setDate('');
    setType('');
    setStatus('ACTIVE'); // Default to active
    setPage(1);
  };

  // Get a specific facility by ID with reservations
  const getFacilityById = async id => {
    try {
      const result = await facilityService.getFacilityById(id);

      if (result.success) {
        return result.data;
      } else {
        addToast(result.error || 'Error al cargar la instalación', 'error');
        return null;
      }
    } catch (error) {
      addToast(error.message || 'Error desconocido al cargar la instalación', 'error');
      return null;
    }
  };

  // Create new facility
  const createFacility = async facilityData => {
    try {
      const result = await facilityService.createFacility(facilityData);

      if (result.success) {
        return result.data;
      } else {
        addToast(result.error || 'Error al crear instalación', 'error');
        return null;
      }
    } catch (error) {
      addToast(error.message || 'Error desconocido al crear instalación', 'error');
      return null;
    }
  };

  // Update existing facility
  const updateFacility = async (id, facilityData) => {
    try {
      const result = await facilityService.updateFacility(id, facilityData);

      if (result.success) {
        return result.data;
      } else {
        addToast(result.error || 'Error al actualizar instalación', 'error');
        return null;
      }
    } catch (error) {
      addToast(error.message || 'Error desconocido al actualizar instalación', 'error');
      return null;
    }
  };

  // Delete a facility
  const deleteFacility = async id => {
    try {
      const result = await facilityService.deleteFacility(id);

      if (result.success) {
        return true;
      } else {
        addToast(result.error || 'Error al eliminar instalación', 'error');
        return false;
      }
    } catch (error) {
      addToast(error.message || 'Error desconocido al eliminar instalación', 'error');
      return false;
    }
  };

  // Delete a reservation (placeholder for future implementation)
  const deleteReservation = async (facilityId, reservationId) => {
    try {
      // Placeholder for deleting reservation - in the future this would call a service method
      console.log('Deleting reservation:', reservationId, 'from facility:', facilityId);
      return true;
    } catch (error) {
      addToast(error.message || 'Error al eliminar la reservación', 'error');
      return false;
    }
  };

  // Get facility with reservations for a specific date
  const getFacilityWithReservations = async (id, date) => {
    try {
      const result = await facilityService.getFacilityWithReservations(id, date);

      if (result.success) {
        return result.data;
      } else {
        addToast(result.error || 'Error al cargar la instalación', 'error');
        return null;
      }
    } catch (error) {
      addToast(error.message || 'Error desconocido al cargar la instalación', 'error');
      return null;
    }
  };

  // Create facility reservation
  const createFacilityReservation = async (facilityId, memberId, reservationData) => {
    try {
      const result = await facilityService.createFacilityReservation(
        facilityId,
        memberId,
        reservationData,
      );

      if (result.success) {
        return result.data;
      } else {
        addToast(result.error || 'Error al crear reservación', 'error');
        return null;
      }
    } catch (error) {
      addToast(error.message || 'Error desconocido al crear reservación', 'error');
      return null;
    }
  };

  // Update facility reservation (to cancel)
  const updateFacilityReservation = async (reservationId, clubMemberId, reservationData) => {
    try {
      const result = await facilityService.updateFacilityReservation(
        reservationId,
        clubMemberId,
        reservationData,
      );

      if (result.success) {
        return result.data;
      } else {
        addToast(result.error || 'Error al actualizar reservación', 'error');
        return null;
      }
    } catch (error) {
      addToast(error.message || 'Error desconocido al actualizar reservación', 'error');
      return null;
    }
  };

  // Search club members for reservations
  const searchClubMembers = async (search = '') => {
    try {
      const result = await facilityService.searchClubMembers(search);

      if (result.success) {
        return result.data.members || [];
      } else {
        addToast(result.error || 'Error al buscar socios', 'error');
        return [];
      }
    } catch (error) {
      addToast(error.message || 'Error desconocido al buscar socios', 'error');
      return [];
    }
  };

  return {
    facilities,
    meta,
    loading,
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
    getFacilityWithReservations,
    deleteReservation,
    createFacilityReservation,
    updateFacilityReservation,
    searchClubMembers,
  };
}
