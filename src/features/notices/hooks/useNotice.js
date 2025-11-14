import { useState, useEffect } from 'react';
import { noticeService } from '../services';

export const useNotice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null); // Pagination metadata
  const [status, setStatus] = useState('activas'); // Default to active
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Load notices with pagination, search, and filters
  const loadNotices = async (params = {}) => {
    try {
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

      setNotices(response.data || []);
      setMeta(response.meta || null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading notices:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle notice status (activate/deactivate)
  const toggleNoticeStatus = async (id, active) => {
    try {
      const activeValue = !active;
      const updatedNotice = await noticeService.toggleNoticeStatus(id, activeValue);
      if (updatedNotice) {
        // Update the notice in the current list
        setNotices(prev => 
          prev.map(notice => 
            notice.id === id ? updatedNotice : notice
          )
        );
        
        // Refresh the list to maintain consistency
        await loadNotices();
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Create new notice
  const createNotice = async (noticeData) => {
    try {
      setLoading(true);
      const newNotice = await noticeService.createNotice(noticeData);
      
      // Refresh the list
      await loadNotices();
      
      return newNotice;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update existing notice
  const updateNotice = async (id, noticeData) => {
    try {
      setLoading(true);
      const updatedNotice = await noticeService.updateNotice(id, noticeData);
      
      // Update the notice in the current list
      setNotices(prev => 
        prev.map(notice => 
          notice.id === id ? updatedNotice : notice
        )
      );
      
      // Refresh the list to maintain consistency
      await loadNotices();
      
      return updatedNotice;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get a single notice by ID
  const getNoticeById = async (id) => {
    try {
      const notice = await noticeService.getNoticeById(id);
      return notice;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Delete a notice
  const deleteNotice = async (id) => {
    try {
      const success = await noticeService.deleteNotice(id);
      if (success) {
        // Refresh the list after deletion
        if (notices.length === 1 && page > 1) {
          // If this was the last item on the page and we're not on page 1, go to previous page
          setPage(prev => prev - 1);
        } else {
          await loadNotices();
        }
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Load initial data when filters or page changes
  useEffect(() => {
    loadNotices();
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