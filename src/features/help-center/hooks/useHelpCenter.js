import { useState, useEffect } from 'react';
import { helpCenterService } from '../services';
import { useContext } from 'react';
import { AppContext } from '../../../shared/context/AppContext';

export const useHelpCenter = () => {
  const { addLog, addToast } = useContext(AppContext);
  const [helpCenters, setHelpCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load help centers
  const loadHelpCenters = async () => {
    try {
      setLoading(true);
      const result = await helpCenterService.fetchHelpCenter();

      if (result.success) {
        setHelpCenters(result.data);
      } else {
        addLog('Error al cargar las entradas del centro de ayuda');
        addToast(result.error || 'Error desconocido', 'error');
        return;
      }
    } catch (err) {
      addLog('Error desconocido al cargar las entradas del centro de ayuda');
      addToast(err.message || 'Error desconocido', 'error');
      return;
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    loadHelpCenters();
  }, [addLog, addToast]);

  // Create new help center
  const createHelpCenter = async helpCenterData => {
    try {
      setLoading(true);
      const result = await helpCenterService.createHelpCenter(helpCenterData);

      if (result.success) {
        loadHelpCenters(); // Reload the list
        return result.data;
      } else {
        addToast(result.error || 'Error desconocido', 'error');
        return null;
      }
    } catch (err) {
      addToast(err.message || 'Error desconocido', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update existing help center
  const updateHelpCenter = async (id, helpCenterData) => {
    try {
      setLoading(true);
      const result = await helpCenterService.updateHelpCenter(id, helpCenterData);

      if (result.success) {
        loadHelpCenters(); // Reload the list
        return result.data;
      } else {
        addToast(result.error || 'Error desconocido', 'error');
        return null;
      }
    } catch (err) {
      addToast(err.message || 'Error desconocido', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get a single help center by ID
  const getHelpCenterById = async id => {
    try {
      setLoading(true);
      const result = await helpCenterService.getHelpCenterById(id);

      if (result.success) {
        return result.data;
      } else {
        addToast(result.error || 'Error desconocido', 'error');
        return null;
      }
    } catch (err) {
      addToast(err.message || 'Error desconocido', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a help center
  const deleteHelpCenter = async id => {
    try {
      const result = await helpCenterService.deleteHelpCenter(id);
      if (result.success) {
        loadHelpCenters(); // Reload the list
        return true;
      } else {
        addToast(result.error || 'Error desconocido', 'error');
        return false;
      }
    } catch (err) {
      addToast(err.message || 'Error desconocido', 'error');
      return false;
    }
  };

  return {
    helpCenters,
    loading,
    error,
    loadHelpCenters,
    createHelpCenter,
    updateHelpCenter,
    getHelpCenterById,
    deleteHelpCenter,
    addLog,
    addToast,
  };
};
