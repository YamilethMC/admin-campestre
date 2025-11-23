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
      orderBy: 'name' // Fixed as requested
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
    resetFilters
  };
}