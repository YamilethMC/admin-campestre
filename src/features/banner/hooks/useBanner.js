import { useState, useEffect, useContext } from 'react';
import { bannerService } from '../services';
import { AppContext } from '../../../shared/context/AppContext';

export const useBanner = () => {
  const { addToast } = useContext(AppContext);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null); // Pagination metadata
  const [status, setStatus] = useState('activas'); // Default to active
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Load banners with pagination, search, and filters
  const loadBanners = async (params = {}) => {
    setLoading(true);
    setError(null);

    // Use provided params or current state
    const currentParams = {
      page: params.page || page,
      limit: 10, // Fixed limit as requested
      search: params.search || search,
      active: params.status || status === 'activas', // Convert status to boolean
      order: 'asc', // Fixed as requested
      orderBy: 'createdAt' // Fixed as requested
    };

    const response = await bannerService.fetchBanners(currentParams);

    if (response.success) {
      setBanners(response.data.data || []);
      setMeta(response.data.meta || null);
    } else {
      if (response.status === 401) {
        // No mostramos alerta aquí porque el servicio ya la maneja
        return;
      }
      addToast(response.error || 'Error al cargar banners', 'error');
      console.error('Error loading banners:', response.error);
    }

    setLoading(false);
  };

  // Create new banner
  const createBanner = async (bannerData) => {
    setLoading(true);
    const result = await bannerService.createBanner(bannerData);

    if (result.success) {
      // Refresh the list
      await loadBanners();
    } else {
      if (result.status === 401) {
        // No mostramos alerta aquí porque el servicio ya la maneja
        return;
      }
      addToast(result.error || 'Error al registrar banner', 'error');
      // Don't navigate away on error - let the form handle navigation
      setLoading(false);
      return Promise.reject(result.error || 'Error al registrar banner');
    }
    setLoading(false);
  };

  // Update existing banner
  const updateBanner = async (id, bannerData) => {
    setLoading(true);
    const result = await bannerService.updateBanner(id, bannerData);

    if (result.success) {
      // Refresh the list to maintain consistency
      await loadBanners();
    } else {
      if(result.status === 401) {
        // No mostramos alerta aquí porque el servicio ya la maneja
        return;
      }
      addToast(result.error || 'Error al actualizar banner', 'error');
      // Don't navigate away on error - let the form handle navigation
      setLoading(false);
      return Promise.reject(result.error || 'Error al actualizar banner');
    }
    setLoading(false);
  };

  // Get a single banner by ID
  const getBannerById = async (id) => {
    const result = await bannerService.getBannerById(id);

    if (result.success) {
      return result.data;
    } else {
      if (result.status === 401) {
        // No mostramos alerta aquí porque el servicio ya la maneja
        return;
      } 
      addToast(result.error || 'Error al obtener banner', 'error');
    }
  };

  // Delete a banner
  const deleteBanner = async (id) => {
    const result = await bannerService.deleteBanner(id);

    if (result.success) {
      // Refresh the list after deletion
      if (banners.length === 1 && page > 1) {
        // If this was the last item on the page and we're not on page 1, go to previous page
        setPage(prev => prev - 1);
      } else {
        await loadBanners();
      }
      return true;
    } else {
      if (result.status === 401) {
        // No mostramos alerta aquí porque el servicio ya la maneja
        return;
      }
      addToast(result.error || 'Error al eliminar el banner', 'error');
    }
  };

  // Toggle banner status
    const toggleBannerStatus = async (id, active) => {
      try {
        const result = await bannerService.toggleBannerStatus(id, active);
  
        if (result.success) {
          loadBanners();
        } else {
          // Verificar si es un error de autenticación
          if (result.status === 401) {
            // No mostramos alerta aquí porque el servicio ya la maneja
            return;
          }
          addToast(result.error || 'Error desconocido', 'error');
          return;
        }
      } catch (err) {
        addToast(err.message || 'Error desconocido', 'error');
        return;
      }
    };

  // Set up auto-refresh every 30 minutes (1800000 ms)
  useEffect(() => {
    const autoRefreshInterval = setInterval(() => {
      loadBanners();
    }, 1800000); // 30 minutes = 1800000 ms

    // Initial load
    loadBanners();

    // Cleanup interval on unmount
    return () => {
      clearInterval(autoRefreshInterval);
    };
  }, [page, status, search]);

  return {
    banners,
    loading,
    error,
    meta,
    status,
    setStatus,
    search,
    setSearch,
    page,
    setPage,
    loadBanners,
    createBanner,
    updateBanner,
    getBannerById,
    deleteBanner,
    toggleBannerStatus
  };
};