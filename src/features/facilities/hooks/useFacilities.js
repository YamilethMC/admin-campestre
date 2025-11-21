import { useEffect, useState } from 'react';
import { facilityService } from '../services';

export function useFacilities(initialFilters = {}) {
  const [facilities, setFacilities] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');

  const loadFacilities = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await facilityService.fetchFacilities({
        page: filters.page !== undefined ? filters.page : page,
        limit: 10, // Fixed limit as requested
        search: filters.search !== undefined ? filters.search : search,
        status: filters.status !== undefined ? filters.status : status,
        type: filters.type !== undefined ? filters.type : type,
        date: filters.date !== undefined ? filters.date : date,
        order: 'asc', // Fixed as requested
        orderBy: 'name' // Fixed as requested
      });
      
      setFacilities(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar instalaciones');
      console.error("Error loading facilities:", err);
    } finally {
      setLoading(false);
    }
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

  return {
    facilities,
    meta,
    loading,
    error,
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
  };
}