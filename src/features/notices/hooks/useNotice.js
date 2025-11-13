import { useState, useEffect } from 'react';
import { noticeService } from '../services';

export const useNotice = () => {
  const [allNotices, setAllNotices] = useState([]); // Store all notices
  const [filteredNotices, setFilteredNotices] = useState([]); // Store filtered notices
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ active: 0, inactive: 0 });
  const [filters, setFilters] = useState({
    status: 'todas',
    search: ''
  });

  // Load all notices and stats
  const loadAllNotices = async () => {
    try {
      setLoading(true);
      // Load unfiltered notices
      const noticesData = await noticeService.getNotices(); // No filters - get all
      setAllNotices(noticesData);
      
      const statsData = await noticeService.getNoticeStats();
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to all notices
  const applyFilters = () => {
    let result = [...allNotices];
    
    // Apply status filter
    if (filters.status) {
      if (filters.status === 'activas') {
        result = result.filter(notice => notice.isActive);
      } else if (filters.status === 'inactivas') {
        result = result.filter(notice => !notice.isActive);
      }
      // If status is 'todas', no additional filtering is needed
    }
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(notice => 
        notice.title.toLowerCase().includes(searchTerm) || 
        notice.description.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredNotices(result);
  };

  // Load initial data
  useEffect(() => {
    loadAllNotices();
  }, []);

  // Apply filters whenever filters change or all notices change
  useEffect(() => {
    applyFilters();
  }, [filters, allNotices]);

  // Toggle notice status
  const toggleNoticeStatus = async (id) => {
    try {
      const updatedNotice = await noticeService.toggleNoticeStatus(id);
      if (updatedNotice) {
        // Update the all notices list with the new status
        setAllNotices(prevNotices =>
          prevNotices.map(notice =>
            notice.id === id ? updatedNotice : notice
          )
        );
        
        // Update stats
        const updatedStats = await noticeService.getNoticeStats();
        setStats(updatedStats);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Create new notice
  const createNotice = async (noticeData) => {
    try {
      console.log('noticeData: ', noticeData);
      setLoading(true);
      const newNotice = await noticeService.createNotice(noticeData);
      // Add the new notice to all notices
      setAllNotices(prev => [...prev, newNotice]);
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
      if (updatedNotice) {
        // Update the all notices list with the new notice data
        setAllNotices(prevNotices =>
          prevNotices.map(notice =>
            notice.id === id ? updatedNotice : notice
          )
        );
        
        // Update stats
        const updatedStats = await noticeService.getNoticeStats();
        setStats(updatedStats);
      }
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
      setLoading(true);
      const notice = await noticeService.getNoticeById(id);
      return notice;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  // Delete a notice
  const deleteNotice = async (id) => {
    try {
      const success = await noticeService.deleteNotice(id);
      if (success) {
        // Remove the deleted notice from all notices
        setAllNotices(prev => prev.filter(notice => notice.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Reset filters to default
  const resetFilters = () => {
    setFilters({
      status: 'todas',
      search: ''
    });
  };

  return {
    notices: filteredNotices, // Return filtered notices
    loading,
    error,
    stats,
    filters,
    loadNotices: loadAllNotices,
    toggleNoticeStatus,
    createNotice,
    updateNotice,
    getNoticeById,
    updateFilters,
    resetFilters,
    deleteNotice
  };
};