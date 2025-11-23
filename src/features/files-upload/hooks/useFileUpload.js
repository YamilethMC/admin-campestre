import { useState, useEffect } from 'react';
import { fileUploadService } from '../services';

export const useFileUpload = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);

  const loadFiles = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fileUploadService.getFiles({
        page: params.page || page,
        limit: 10,
        search: params.search || search,
        order: 'asc',
        orderBy: 'name'
      });

      setFiles(response.data || []);
      setMeta(response.meta || null);
    } catch (err) {
      console.error('Error loading files:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (fileData) => {
    try {
      setUploading(true);
      setError(null);

      const response = await fileUploadService.uploadFile(fileData);

      return response;
    } catch (err) {
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const getFileById = async (id) => {
    try {
      const response = await fileUploadService.getFileById(id);
      return response;
    } catch (err) {
      throw err;
    }
  };

  const updateFile = async (id, fileData) => {
    try {
      const response = await fileUploadService.updateFile(id, fileData);
      // Refresh the list after update
      await loadFiles();
      return response;
    } catch (err) {
      throw err;
    }
  };

  const deleteFile = async (id) => {
    try {
      const response = await fileUploadService.deleteFile(id);
      // Refresh the list after deletion
      // Check if this was the last file on the current page and we're not on the first page
      if (files.length === 1 && page > 1) {
        setPage(prev => prev - 1);
        // The useEffect will handle reloading based on the page change
      } else {
        await loadFiles();
      }
      return response;
    } catch (err) {
      throw err;
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