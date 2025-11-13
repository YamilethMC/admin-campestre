import React, { useState, useContext } from 'react';
import FileUploadForm from '../components/FileUploadForm';
import FileUploadHeader from '../components/FileUploadHeader';
import FileUploadList from '../components/FileUploadList';
import { useFileUpload } from '../hooks/useFileUpload';
import { AppContext } from '../../../shared/context/AppContext';

const FileUploadContainer = () => {
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [currentFile, setCurrentFile] = useState(null);
  const { setToasts } = useContext(AppContext);

  const {
    files,
    loading,
    error,
    meta,
    page,
    setPage,
    search,
    setSearch,
    loadFiles,
    getFileById,
    updateFile,
    deleteFile
  } = useFileUpload();

  // Handle adding a new file
  const handleAddFile = () => {
    setCurrentFile(null);
    setView('form');
  };

  // Handle editing a file
  const handleEditFile = async (file) => {
    try {
      // Get the full file data
      const fullFile = await getFileById(file.id);
      setCurrentFile(fullFile);
      setView('form');
    } catch (err) {
      setToasts(prev => [...prev, {
        id: Date.now(),
        message: 'Error al cargar los datos del archivo',
        type: 'error'
      }]);
      console.error('Error fetching file:', err);
    }
  };

  // Handle saving a file (create or update)
  const handleSaveFile = async (fileData) => {
    try {
      if (currentFile) {
        // Update existing file
        await updateFile(currentFile.id, fileData);
      } else {
        // Create new file is handled in the form component separately
        setView('list');
      }
      setView('list');
      loadFiles();
      
      setToasts(prev => [...prev, {
        id: Date.now(),
        message: currentFile ? 'Documento actualizado correctamente' : 'Documento guardado correctamente',
        type: 'success'
      }]);
    } catch (err) {
      setToasts(prev => [...prev, {
        id: Date.now(),
        message: `Error al ${currentFile ? 'actualizar' : 'guardar'} el documento`,
        type: 'error'
      }]);
      console.error('Error saving file:', err);
    }
  };

  // Handle canceling form
  const handleCancelForm = () => {
    setView('list');
    setCurrentFile(null);
  };

  // Handle deleting a file
  const handleDeleteFile = async (id) => {
    try {
      await deleteFile(id);
      loadFiles();
      
      setToasts(prev => [...prev, {
        id: Date.now(),
        message: 'Documento eliminado correctamente',
        type: 'success'
      }]);
    } catch (err) {
      setToasts(prev => [...prev, {
        id: Date.now(),
        message: 'Error al eliminar el documento',
        type: 'error'
      }]);
      console.error('Error deleting file:', err);
    }
  };

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  // Render the current view
  if (view === 'form') {
    return (
      <div className="max-w-2xl mx-auto">
        <FileUploadHeader />
        <FileUploadForm
          file={currentFile}
          onSave={handleSaveFile}
          onCancel={handleCancelForm}
        />
      </div>
    );
  }

  // Default list view
  return (
    <div>
      <FileUploadHeader />
      <FileUploadList
        files={files}
        loading={loading}
        meta={meta}
        page={page}
        setPage={setPage}
        search={search}
        setSearch={setSearch}
        onEdit={handleEditFile}
        onDelete={handleDeleteFile}
        onAddFile={handleAddFile}
      />
    </div>
  );
};

export default FileUploadContainer;