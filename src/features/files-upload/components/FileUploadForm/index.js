import React, { useState, useEffect } from 'react';
import { useFileUpload } from '../../hooks/useFileUpload';

const FileUploadForm = ({ file: currentFile, onSave, onCancel }) => {
  const { uploadFile } = useFileUpload();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileDescription, setFileDescription] = useState('');
  const [fileType, setFileType] = useState('');
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);

  // Initialize form with current file data if editing
  useEffect(() => {
    if (currentFile) {
      setFileName(currentFile.name || '');
      setFileDescription(currentFile.description || '');
      setFileType(currentFile.type || '');
    } else {
      // Reset form for new file
      setFile(null);
      setFileName('');
      setFileDescription('');
      setFileType('');
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
    }
  }, [currentFile]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Set default file name as the actual filename without extension
      const nameWithoutExtension = selectedFile.name.replace(/\.[^/.]+$/, "");
      setFileName(nameWithoutExtension);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileName('');
    // Reset file input
    const fileInput = document.getElementById('file-input');
    if (fileInput) fileInput.value = '';
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate file (required for new files)
    if (!currentFile && !file) {
      newErrors.file = 'Archivo es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Show confirmation modal before saving
      confirmAction('save');
    }
  };

  const handleSaveConfirm = async () => {
    if (!validateForm()) {
      return;
    }

    setIsUploading(true);

    try {
      let fileData = {
        name: fileName,
        description: fileDescription,
        type: fileType || 'pdf'
      };

      if (!currentFile) {
        // Creating a new file - include the file
        fileData.file = file;
        await uploadFile(fileData);
      } else {
        // Updating existing file - call the onSave function from parent
        await onSave(fileData);
      }

      // Reset form
      handleClearForm();

      // Call onCancel to go back to the list view after successful save/update
      if (onCancel) {
        onCancel();
      }
    } catch (error) {
    } finally {
      setIsUploading(false);
      setShowConfirmationModal(false);
      setModalAction(null);
    }
  };

  const handleClearForm = () => {
    setFile(null);
    setFileName('');
    setFileDescription('');
    setFileType('');
    const fileInput = document.getElementById('file-input');
    if (fileInput) fileInput.value = '';
  };

  const confirmAction = (action) => {
    setModalAction(action);
    setShowConfirmationModal(true);
  };

  const handleConfirm = () => {
    if (modalAction === 'back' || modalAction === 'cancel') {
      if (onCancel) {
        onCancel();
      }
    } else if (modalAction === 'save') {
      handleSaveConfirm();
    }
    // The modal closing is handled in each specific function
  };

  const handleCancel = () => {
    setShowConfirmationModal(false);
    setModalAction(null);
  };

  const handleCancelForm = () => {
    // If there are changes, show confirmation
    if (isFormDirty()) {
      confirmAction('cancel');
    } else {
      if (onCancel) {
        onCancel();
      }
    }
  };

  const handleBack = () => {
    if (isFormDirty()) {
      confirmAction('back');
    } else {
      if (onCancel) {
        onCancel();
      }
    }
  };

  const isFormDirty = () => {
    // Check if any form field has been modified
    return (
      fileName !== (currentFile?.name || '') ||
      fileDescription !== (currentFile?.description || '') ||
      fileType !== (currentFile?.type || '') ||
      file !== null
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={handleBack}
          className="flex items-center text-primary hover:text-primary-dark font-medium"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Regresar
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {!currentFile && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecciona un archivo <span className="text-red-500">*</span>
            </label>

            <div className="flex items-center space-x-4">
              <label className="flex-1 cursor-pointer">
                <div className={`flex items-center justify-center px-4 py-6 border-2 border-dashed rounded-lg hover:border-primary transition-colors ${
                  errors.file ? 'border-red-500' : 'border-gray-300'
                }`}>
                  {file ? (
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-gray-700 truncate max-w-xs">{file.name}</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-gray-600">Haz clic para seleccionar un archivo</p>
                      <p className="text-gray-500 text-sm mt-1">PDF, DOC, DOCX, XLS, XLSX (máx. 10MB)</p>
                    </div>
                  )}
                </div>
                <input
                  id="file-input"
                  type="file"
                  onChange={(e) => {
                    handleFileChange(e);
                    // Clear error when user selects a file
                    if (errors.file) {
                      setErrors(prev => ({ ...prev, file: '' }));
                    }
                  }}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                />
              </label>

              {file && (
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  Eliminar
                </button>
              )}
            </div>
            {errors.file && <p className="mt-1 text-sm text-red-600">{errors.file}</p>}

            {isUploading && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full animate-pulse"
                    style={{ width: '60%' }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">Cargando archivo...</p>
              </div>
            )}
          </div>
        )}
        { currentFile && (
          <>
          <div className="mb-6">
            <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del archivo
            </label>
            <input
            type="text"
            id="fileName"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ingresa el nombre del documento"
          />
        </div>
      
        <div className="mb-6">
          <label htmlFor="fileDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            id="fileDescription"
            value={fileDescription}
            onChange={(e) => setFileDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ingresa una descripción del documento"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="fileType" className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de documento
          </label>
          <input
            type="text"
            id="fileType"
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ingresa el tipo de documento (ej. pdf, docx)"
          />
        </div>
        </>
)}
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={isUploading}
            className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors disabled:opacity-50"
          >
            {isUploading ? (currentFile ? 'Actualizando...' : 'Guardando...') : (currentFile ? 'Actualizar' : 'Guardar')}
          </button>

          <button
            type="button"
            onClick={handleCancelForm}
            className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmar acción</h3>
            <p className="text-gray-600 mb-4">
              {modalAction === 'back' || modalAction === 'cancel' 
                ? '¿Estás seguro que deseas regresar? Los cambios no guardados se perderán.'
                : '¿Estás seguro que deseas guardar los cambios?'}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                onClick={handleCancel}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none"
                onClick={handleConfirm}
              >
                {modalAction === 'save' ? 'Guardar' : 'Aceptar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadForm;