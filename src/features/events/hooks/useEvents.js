import { useState, useEffect } from 'react';
import { eventService } from '../services';
import { EventTypes } from '../interfaces';
import { useContext } from 'react';
import { AppContext } from '../../../shared/context/AppContext';

export const useEvents = () => {
  const { addLog, addToast } = useContext(AppContext);
  const [events, setEvents] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [type, setType] = useState(EventTypes.ALL);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7)); // Current year-month

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEvents = async ({page: pageParam = 1, search: searchParam = search, type: typeParam = type, date: dateParam = date} = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await eventService.fetchEvents({ 
        page: pageParam, 
        search: searchParam, 
        type: typeParam, 
        date: dateParam 
      });
      
      if (data.success) {
        setEvents(data.data.events);
        setMeta(data.data.meta);
      } else {
        setError(data.error);
        addLog(data.error);
        addToast(data.error, 'error');
      }
    } catch (err) {
      setError(err.message);
      addLog(err.message);
      addToast(err.message || 'Error desconocido', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    loadEvents({page, search, type, date});
  }, [addLog, addToast, page, search, type, date]);

  // Create new event
  const createEvent = async (eventData) => {
    try {
      setLoading(true);
      const result = await eventService.createEvent(eventData);
      if (result.success) {
        addToast(result.message, 'success');
        // Reload events after creation
        loadEvents();
        return result.data;
      } else {
        addToast(result.error, 'error');
        return null;
      }
    } catch (err) {
      addToast(err.message || 'Error desconocido', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update existing event
  const updateEvent = async (id, eventData) => {
    try {
      setLoading(true);
      const result = await eventService.updateEvent(id, eventData);
      if (result.success) {
        // Reload events after update
        loadEvents();
        return result.data;
      } else {
        addToast(result.error, 'error');
        return null;
      }
    } catch (err) {
      addToast(err.message || 'Error desconocido', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get a single event by ID
  const getEventById = async (id) => {
    try {
      setLoading(true);
      const result = await eventService.getEventById(id);
      if (result.success) {
        return result.data;
      } else {
        addToast(result.error, 'error');
        return null;
      }
    } catch (err) {
      addToast(err.message || 'Error desconocido', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete an event
  const deleteEvent = async (id) => {
    try {
      setLoading(true);
      const result = await eventService.deleteEvent(id);
      if (result.success) {
        addToast(result.message, 'success');
        // If the list is empty and we're not on page 1, go back a page
        if (events.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          loadEvents(); // Reload events after deletion
        }
        return true;
      } else {
        addToast(result.error, 'error');
        return false;
      }
    } catch (err) {
      addToast(err.message || 'Error desconocido', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update event registration
  const updateEventRegistration = async (eventId, memberId, registrationData) => {
    try {
      setLoading(true);
      const result = await eventService.updateEventRegistration(eventId, memberId, registrationData);
      if (result.success) {
        addToast(result.message, 'success');
        return result.data;
      } else {
        addToast(result.error, 'error');
        return null;
      }
    } catch (err) {
      addToast(err.message || 'Error desconocido', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete event registration
  const deleteEventRegistration = async (eventId, memberId) => {
    try {
      setLoading(true);
      const result = await eventService.deleteEventRegistration(eventId, memberId);
      if (result.success) {
        addToast(result.message, 'success');
        return result.data;
      } else {
        addToast(result.error, 'error');
        return null;
      }
    } catch (err) {
      addToast(err.message || 'Error desconocido', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Reset filters to defaults
  const resetFilters = () => {
    setSearch('');
    setType(EventTypes.ALL);
    const now = new Date();
    setDate(now.toISOString().slice(0, 7)); // YYYY-MM format
    setPage(1);
  };

  // Update filters
  const updateFilters = ({ search: newSearch, type: newType, date: newDate, page: newPage }) => {
    if (newSearch !== undefined) setSearch(newSearch);
    if (newType !== undefined) setType(newType);
    if (newDate !== undefined) setDate(newDate);
    if (newPage !== undefined) setPage(newPage);
  };

  return {
    events,
    meta,
    page,
    setPage,
    search,
    setSearch,
    type,
    setType,
    date,
    setDate,
    loading,
    error,
    loadEvents,
    createEvent,
    updateEvent,
    getEventById,
    deleteEvent,
    updateEventRegistration,
    deleteEventRegistration,
    resetFilters,
    updateFilters,
    addLog,
    addToast
  };
};