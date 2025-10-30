import React, { useState } from 'react';
import { useFileUpload } from '../../hooks/useFileUpload';
import { useContext } from 'react';
import { AppContext } from '../../../../shared/context/AppContext';

const FileUploadForm = () => {
  const { uploadFile } = useFileUpload();
  const { setToasts } = useContext(AppContext);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileDescription, setFileDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setToasts(prev => [...prev, {
        id: Date.now(),
        message: 'Por favor selecciona un archivo',
        type: 'error'
      }]);
      return;
    }

    if (!fileName.trim()) {
      setToasts(prev => [...prev, {
        id: Date.now(),
        message: 'Por favor ingresa un nombre para el archivo',
        type: 'error'
      }]);
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate API call
      await uploadFile({
        file: file,
        name: fileName,
        description: fileDescription
      });
      
      setToasts(prev => [...prev, {
        id: Date.now(),
        message: 'Documento guardado correctamente',
        type: 'success'
      }]);
      
      // Reset form
      handleClearForm();
    } catch (error) {
      setToasts(prev => [...prev, {
        id: Date.now(),
        message: 'Error al guardar el documento',
        type: 'error'
      }]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearForm = () => {
    setFile(null);
    setFileName('');
    setFileDescription('');
    const fileInput = document.getElementById('file-input');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecciona un archivo
          </label>
          
          <div className="flex items-center space-x-4">
            <label className="flex-1 cursor-pointer">
              <div className="flex items-center justify-center px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors">
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
                onChange={handleFileChange}
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
            placeholder="Ingresa el nombre del archivo"
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
            placeholder="Ingresa una descripción del archivo (opcional)"
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={isUploading}
            className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors disabled:opacity-50"
          >
            {isUploading ? 'Guardando...' : 'Guardar'}
          </button>
          
          <button
            type="button"
            onClick={handleClearForm}
            className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FileUploadForm;