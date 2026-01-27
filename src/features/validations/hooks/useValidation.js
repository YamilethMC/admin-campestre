import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../../shared/context/AppContext';
import validationService from '../services';

export const useValidation = () => {
  const { addLog, addToast } = useContext(AppContext);

  const [validations, setValidations] = useState([]);
  const [validationDetails, setValidationDetails] = useState(null);
  const [loadingValidations, setLoadingValidations] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    inReview: 0
  });

  const [filters, setFilters] = useState({
    status: '',
    search: '',
    page: 1,
    limit: 10
  });

  const loadValidations = async (customFilters = null) => {
    try {
      setLoadingValidations(true);
      const filterData = customFilters || filters;
      const response = await validationService.getValidations(filterData);
      const validationsArray = response?.data ?? [];

      setValidations(validationsArray);
      addLog(`Validaciones cargadas: ${validationsArray.length} registros`);
    } catch (error) {
      console.error('Error loading validations:', error);
      addToast('Error al cargar las validaciones', 'error');
      setValidations([]);
    } finally {
      setLoadingValidations(false);
    }
  };

  const loadValidationDetails = async (validationId) => {
    try {
      setLoadingDetails(true);
      const response = await validationService.getValidationDetails(validationId);
      setValidationDetails(response);
      return response;
    } catch (error) {
      console.error('Error loading validation details:', error);
      addToast('Error al cargar los detalles de la validación', 'error');
      return null;
    } finally {
      setLoadingDetails(false);
    }
  };

  const updateValidationStatus = async (validationId, status, rejectionReason = null) => {
    try {
      await validationService.updateValidationStatus(validationId, status, rejectionReason);
      addLog(`Estado de validación actualizado: ${validationService.formatStatus(status)}`);
      addToast('Estado de validación actualizado correctamente', 'success');
      
      await loadValidations();
      if (validationDetails?.id === validationId) {
        await loadValidationDetails(validationId);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating validation status:', error);
      addToast('Error al actualizar el estado de la validación', 'error');
      return false;
    }
  };

  const updateDocumentStatus = async (documentId, status, notes = null) => {
    try {
      await validationService.updateDocumentStatus(documentId, status, notes);
      addLog(`Estado de documento actualizado: ${validationService.formatStatus(status)}`);
      addToast('Estado de documento actualizado correctamente', 'success');
      
      if (validationDetails) {
        await loadValidationDetails(validationDetails.id);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating document status:', error);
      addToast('Error al actualizar el estado del documento', 'error');
      return false;
    }
  };

  const loadStats = async () => {
    try {
      const quickStats = await validationService.getQuickStats();
      setStats(quickStats);
    } catch (error) {
      console.error('Error loading stats:', error);
      addToast('Error al cargar estadísticas', 'error');
    }
  };

  const applyFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    loadValidations(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      status: '',
      search: '',
      page: 1,
      limit: 10
    };
    setFilters(clearedFilters);
    loadValidations(clearedFilters);
  };

  useEffect(() => {
    loadValidations();
    loadStats();
  }, []);

  return {
    validations,
    validationDetails,
    stats,
    filters,
    loadingValidations,
    loadingDetails,
    loadValidations,
    loadValidationDetails,
    updateValidationStatus,
    updateDocumentStatus,
    loadStats,
    applyFilters,
    clearFilters,
    setFilters,
    formatStatus: validationService.formatStatus,
    getStatusColor: validationService.getStatusColor,
    getStatusBadge: validationService.getStatusBadge
  };
};
