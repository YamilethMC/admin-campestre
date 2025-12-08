import { useState, useEffect, useContext } from 'react';
import { noticeService } from '../services';
import { AppContext } from '../../../shared/context/AppContext';

export const useNotice = () => {
  const { addToast } = useContext(AppContext);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null); // Pagination metadata
  const [status, setStatus] = useState('activas'); // Default to active
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Load notices with pagination, search, and filters
  const loadNotices = async (params = {}) => {
    setLoading(true);
    setError(null);

    // Use provided params or current state
    const currentParams = {
      page: params.page || page,
      limit: 10, // Fixed limit as requested
      search: params.search || search,
      active: params.status || status === 'activas', // Convert status to boolean
      order: 'asc', // Fixed as requested
      orderBy: 'title' // Fixed as requested
    };
    const response = await noticeService.fetchNotices(currentParams);

    if (response.success) {
      setNotices(response.data.data || []);
      setMeta(response.data.meta || null);
    } else {
      addToast(response.error || 'Error al cargar avisos', 'error');
      console.error('Error loading notices:', response.error);
    }

    setLoading(false);
  };

  // Toggle notice status (activate/deactivate)
  const toggleNoticeStatus = async (id, active) => {
    const activeValue = !active;
    const result = await noticeService.toggleNoticeStatus(id, activeValue);

    if (result.success) {
      // Refresh the list to maintain consistency
      await loadNotices();
    } else {
      addToast(result.error || 'Error al actualizar estado del aviso', 'error');
    }
  };

  // Create new notice
  const createNotice = async (noticeData) => {
    try {
      setLoading(true);

      // Check if there's an image to convert
      if (noticeData.image && noticeData.image.startsWith('data:image')) {
        // Convert to FormData and send as base64
        const formData = new FormData();

        // Add the notice data as JSON string
        const noticeFields = {
          title: noticeData.title,
          message: noticeData.message,
          active: noticeData.active,
          visibleUntil: noticeData.visibleUntil,
          type: noticeData.type,
          sentDate: new Date().toISOString(),
        };

        formData.append('noticeData', JSON.stringify(noticeFields));

        // Convert image to base64 and add to form data
        const base64Image = noticeData.image.split(',')[1]; // Remove data:image/jpeg;base64, prefix
        formData.append('image', base64Image);

        const result = await noticeService.createNotice(formData);

        if (result.success) {
          // Refresh the list
          await loadNotices();
          return result.data;
        } else {
          addToast(result.error || 'Error al registrar aviso', 'error');
          return null;
        }
      } else {
        // No image to convert, send as JSON data
        const result = await noticeService.createNotice(noticeData);

        if (result.success) {
          // Refresh the list
          await loadNotices();
          return result.data;
        } else {
          addToast(result.error || 'Error al registrar aviso', 'error');
          return null;
        }
      }
    } catch (err) {
      addToast(err.message || 'Error desconocido al registrar aviso', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update existing notice
  const updateNotice = async (id, noticeData) => {
    try {
      setLoading(true);

      // Check if there's an image to convert
      if (noticeData.image && noticeData.image.startsWith('data:image')) {
        // Image has changed, send as FormData
        const formData = new FormData();

        // Add the notice data as JSON string
        const noticeFields = {
          title: noticeData.title,
          message: noticeData.message,
          active: noticeData.active,
          visibleUntil: noticeData.visibleUntil,
          type: noticeData.type,
        };

        formData.append('noticeData', JSON.stringify(noticeFields));

        // Convert image to base64 and add to form data
        const base64Image = noticeData.image.split(',')[1]; // Remove data:image/jpeg;base64, prefix
        formData.append('image', base64Image);

        const result = await noticeService.updateNotice(id, formData);

        if (result.success) {
          // Refresh the list to maintain consistency
          await loadNotices();
          return result.data;
        } else {
          addToast(result.error || 'Error al actualizar aviso', 'error');
          return null;
        }
      } else {
        // No image change, send as JSON data
        const result = await noticeService.updateNotice(id, noticeData);

        if (result.success) {
          // Refresh the list to maintain consistency
          await loadNotices();
          return result.data;
        } else {
          addToast(result.error || 'Error al actualizar aviso', 'error');
          return null;
        }
      }
    } catch (err) {
      addToast(err.message || 'Error desconocido al actualizar aviso', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get a single notice by ID
  const getNoticeById = async (id) => {
    const result = await noticeService.getNoticeById(id);

    if (result.success) {
      return result.data;
    } else {
      addToast(result.error || 'Error al obtener aviso', 'error');
    }
  };

  // Delete a notice
  const deleteNotice = async (id) => {
    const result = await noticeService.deleteNotice(id);

    if (result.success) {
      // Refresh the list after deletion
      if (notices.length === 1 && page > 1) {
        // If this was the last item on the page and we're not on page 1, go to previous page
        setPage(prev => prev - 1);
      } else {
        await loadNotices();
      }
      return true;
    } else {
      addToast(result.error || 'Error al eliminar el aviso', 'error');
    }
  };

  // Set up auto-refresh every 30 minutes (1800000 ms)
  useEffect(() => {
    const autoRefreshInterval = setInterval(() => {
      loadNotices();
    }, 1800000); // 30 minutes = 1800000 ms

    // Initial load
    loadNotices();

    // Cleanup interval on unmount
    return () => {
      clearInterval(autoRefreshInterval);
    };
  }, [page, status, search]);

  return {
    notices,
    loading,
    error,
    meta,
    status,
    setStatus,
    search,
    setSearch,
    page,
    setPage,
    loadNotices,
    toggleNoticeStatus,
    createNotice,
    updateNotice,
    getNoticeById,
    deleteNotice
  };
};