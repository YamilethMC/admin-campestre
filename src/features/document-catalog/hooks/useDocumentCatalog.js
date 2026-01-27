import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../../shared/context/AppContext';
import documentCatalogService from '../services';

export const useDocumentCatalog = () => {
  const { addLog, addToast } = useContext(AppContext);

  const [catalog, setCatalog] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    label: '',
    description: '',
    required: true,
    active: true,
    order: 1,
    acceptedFormats: 'pdf,jpg,jpeg,png',
    maxSizeMB: 10
  });

  const loadCatalog = async (activeOnly = false) => {
    try {
      setLoadingCatalog(true);
      const response = await documentCatalogService.getDocumentCatalog(activeOnly);
      const catalogData = response?.data ?? response ?? [];
      setCatalog(catalogData);
      addLog(`Catálogo cargado: ${catalogData.length} documentos`);
    } catch (error) {
      console.error('Error loading document catalog:', error);
      addToast('Error al cargar el catálogo de documentos', 'error');
      setCatalog([]);
    } finally {
      setLoadingCatalog(false);
    }
  };

  const createDocument = async (documentData) => {
    try {
      await documentCatalogService.createDocumentCatalog(documentData);
      addLog(`Documento creado: ${documentData.label}`);
      addToast('Documento agregado al catálogo correctamente', 'success');
      
      await loadCatalog();
      resetForm();
      return true;
    } catch (error) {
      console.error('Error creating document:', error);
      addToast('Error al crear el documento', 'error');
      return false;
    }
  };

  const updateDocument = async (catalogId, documentData) => {
    try {
      await documentCatalogService.updateDocumentCatalog(catalogId, documentData);
      addLog(`Documento actualizado: ${documentData.label}`);
      addToast('Documento actualizado correctamente', 'success');
      
      await loadCatalog();
      return true;
    } catch (error) {
      console.error('Error updating document:', error);
      addToast('Error al actualizar el documento', 'error');
      return false;
    }
  };

  const deleteDocument = async (catalogId, documentLabel) => {
    try {
      await documentCatalogService.deleteDocumentCatalog(catalogId);
      addLog(`Documento eliminado: ${documentLabel}`);
      addToast('Documento eliminado del catálogo', 'success');
      
      await loadCatalog();
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      addToast('Error al eliminar el documento', 'error');
      return false;
    }
  };

  const toggleDocumentStatus = async (catalogId, currentStatus) => {
    const newStatus = !currentStatus;
    const document = catalog.find(doc => doc.id === catalogId);
    
    if (document) {
      const result = await updateDocument(catalogId, { ...document, active: newStatus });
      if (result) {
        const action = newStatus ? 'activado' : 'desactivado';
        addLog(`Documento ${action}: ${document.label}`);
      }
      return result;
    }
    return false;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const loadDocumentForEdit = (document) => {
    setFormData({
      code: document.code || '',
      label: document.label || '',
      description: document.description || '',
      required: document.required || false,
      active: document.active || false,
      order: document.order || 1,
      acceptedFormats: document.acceptedFormats || 'pdf,jpg,jpeg,png',
      maxSizeMB: document.maxSizeMB || 10
    });
  };

  const resetForm = () => {
    setFormData({
      code: '',
      label: '',
      description: '',
      required: true,
      active: true,
      order: getNextOrder(),
      acceptedFormats: 'pdf,jpg,jpeg,png',
      maxSizeMB: 10
    });
  };

  const getNextOrder = () => {
    if (catalog.length === 0) return 1;
    const maxOrder = Math.max(...catalog.map(doc => doc.order || 0));
    return maxOrder + 1;
  };

  const validateForm = () => {
    if (!formData.code.trim()) {
      addToast('El código es obligatorio', 'error');
      return false;
    }
    
    if (!formData.label.trim()) {
      addToast('El nombre del documento es obligatorio', 'error');
      return false;
    }
    
    if (!formData.acceptedFormats.trim()) {
      addToast('Los formatos aceptados son obligatorios', 'error');
      return false;
    }
    
    if (formData.maxSizeMB <= 0) {
      addToast('El tamaño máximo debe ser mayor a 0', 'error');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e, editingId = null) => {
    e.preventDefault();
    
    if (!validateForm()) return false;

    if (!editingId) {
      const existingCode = catalog.find(doc => 
        doc.code.toLowerCase() === formData.code.toLowerCase()
      );
      
      if (existingCode) {
        addToast('Ya existe un documento con este código', 'error');
        return false;
      }
    }

    const documentData = {
      ...formData,
      order: parseInt(formData.order),
      maxSizeMB: parseFloat(formData.maxSizeMB)
    };

    if (editingId) {
      return await updateDocument(editingId, documentData);
    } else {
      return await createDocument(documentData);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  useEffect(() => {
    if (catalog.length > 0 && formData.order === 1) {
      setFormData(prev => ({
        ...prev,
        order: getNextOrder()
      }));
    }
  }, [catalog]);

  return {
    catalog,
    formData,
    loadingCatalog,
    loadCatalog,
    createDocument,
    updateDocument,
    deleteDocument,
    toggleDocumentStatus,
    loadDocumentForEdit,
    resetForm,
    handleChange,
    handleSubmit,
    validateForm,
    getNextOrder
  };
};
