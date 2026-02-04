import { useState, useEffect, useContext } from 'react';
import { fileUploadService } from '../services';
import { AppContext } from '../../../shared/context/AppContext';

export const useFileUpload = () => {
  const { addToast } = useContext(AppContext);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);

  const loadFiles = async (params = {}) => {
    setLoading(true);
    setError(null);

    const response = await fileUploadService.getFiles({
      page: params.page || page,
      limit: 10,
      search: params.search || search,
      order: 'asc',
      orderBy: 'name'
    });
    if (response.success) {
      setFiles(response.data.data || []);
      setMeta(response.data.meta || null);
    } else {
      // Verificar si es un error de autenticación
      if (response.status === 401) {
        // No mostramos alerta aquí porque el servicio ya la maneja
        return;
      }
      addToast(response.error || 'Error al cargar archivos', 'error');
      console.error('Error loading files:', response.error);
      return;
    }

    setLoading(false);
  };

  const uploadFile = async (fileData) => {
    setUploading(true);
    setError(null);

    const response = await fileUploadService.uploadFile(fileData);

    if (response.success) {
      setUploading(false);
      return response;
    } else {
      // Verificar si es un error de autenticación
      if (response.status === 401) {
        // No mostramos alerta aquí porque el servicio ya la maneja
        return;
      }
      addToast(response.error || 'Error al subir archivo', 'error');
      setUploading(false);
      return;
    }
  };

  const getFileById = async (id) => {
    const response = await fileUploadService.getFileById(id);

    if (response.success) {
      return response.data;
    } else {
      // Verificar si es un error de autenticación
      if (response.status === 401) {
        // No mostramos alerta aquí porque el servicio ya la maneja
        return;
      }
      addToast(response.error || 'Error al obtener archivo', 'error');
      return
    }
  };

  const updateFile = async (id, fileData) => {
    const response = await fileUploadService.updateFile(id, fileData);

    if (response.success) {
      // Refresh the list after update
      await loadFiles();
      return response;
    } else {
      // Verificar si es un error de autenticación
      if (response.status === 401) {
        // No mostramos alerta aquí porque el servicio ya la maneja
        return;
      }
      addToast(response.error || 'Error al actualizar archivo', 'error');
      return;
    }
  };

  const deleteFile = async (id) => {
    const response = await fileUploadService.deleteFile(id);

    if (response.success) {
      // Refresh the list after deletion
      // Check if this was the last file on the current page and we're not on the first page
      if (files.length === 1 && page > 1) {
        setPage(prev => prev - 1);
        // The useEffect will handle reloading based on the page change
      } else {
        await loadFiles();
      }
      return response;
    } else {
      // Verificar si es un error de autenticación
      if (response.status === 401) {
        // No mostramos alerta aquí porque el servicio ya la maneja
        return;
      }
      addToast(response.error || 'Error al eliminar archivo', 'error');
      return;
    }
  };

  // Load files when page, search, or other params change
  useEffect(() => {
    loadFiles();
  }, [page, search]);

  return {
    files,
    loading,
    error,
    meta,
    page,
    setPage,
    search,
    setSearch,
    uploadFile,
    uploading,
    loadFiles,
    getFileById,
    updateFile,
    deleteFile
  };
};