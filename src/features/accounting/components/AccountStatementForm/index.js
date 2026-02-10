import React, { useState, useContext } from 'react';
import { useBulkUploadJobStatus, useBulkUploadMutation, useRecentBulkJobs } from '../../hooks/useBulkUploadJob';
import { AppContext } from '../../../../shared/context/AppContext';
import BulkUploadProgress from '../BulkUploadProgress';

const AccountStatementForm = () => {
  const { addLog, addToast } = useContext(AppContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentJobId, setCurrentJobId] = useState(null);

  const uploadMutation = useBulkUploadMutation();
  const jobStatus = useBulkUploadJobStatus(currentJobId);
  const recentJobs = useRecentBulkJobs();

  // Debug logging
  console.log('Recent jobs query:', {
    isLoading: recentJobs.isLoading,
    isError: recentJobs.isError,
    error: recentJobs.error,
    data: recentJobs.data,
    jobsCount: recentJobs.data?.jobs?.length
  });

  // Check if any job is currently processing
  const hasProcessingJob = recentJobs.data?.jobs?.some(
    job => job.status === 'PROCESSING' || job.status === 'PENDING'
  ) || false;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.zip')) {
      addLog('Error: Por favor sube un archivo ZIP válido');
      addToast('Error: Por favor sube un archivo ZIP válido', 'error');
      return;
    }
    setSelectedFile(file);
    addLog(`Archivo ZIP seleccionado: ${file.name}`);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      addLog('Error: Por favor selecciona un archivo ZIP primero');
      addToast('Error: Por favor selecciona un archivo ZIP primero', 'error');
      return;
    }

    try {
      const result = await uploadMutation.mutateAsync(selectedFile);

      if (result.success) {
        const jobId = result.data?.jobId;
        if (jobId) {
          setCurrentJobId(jobId);
          addLog(`Procesamiento iniciado. Job ID: ${jobId}`);
          addToast('Archivo recibido. El procesamiento ha comenzado.', 'success');
          
          // Clear file input
          setSelectedFile(null);
          const fileInput = document.getElementById('file-input-account-statement');
          if (fileInput) fileInput.value = '';
        } else {
          addLog('Archivo subido pero no se recibió jobId');
          addToast('Archivo subido correctamente', 'success');
        }
      } else {
        const errorMessage = result.error || 'Error al subir el archivo';
        addLog(`Error: ${errorMessage}`);
        addToast(errorMessage, 'error');
      }
    } catch (error) {
      addLog(`Error: ${error.message}`);
      addToast(error.message || 'Error al subir el archivo', 'error');
    }
  };

  const handleCloseProgress = () => {
    setCurrentJobId(null);
  };

  const isUploading = uploadMutation.isPending;
  const hasActiveJob = jobStatus.isActive;
  const uploadDisabled = isUploading || hasActiveJob || hasProcessingJob;

  return (
    <div>
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Estados de Cuenta</h1>
            <p className="text-gray-600">Carga masiva de estados de cuenta</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">   
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Archivo ZIP
          </label>
          <div className="flex items-center">
            <input
              id="file-input-account-statement"
              type="file"
              accept=".zip"
              onChange={handleFileUpload}
              /*onChange={(e) => {
                // Clear the input first to ensure change event fires even if same file is selected
                if (e.target.value) {
                  handleFileUpload(e);
                  e.target.value = null; // Reset the input value
                }
              }}*/
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary/10 file:text-primary
                hover:file:bg-primary/20"
            />
            {/*{selectedFile ? (
              <span className="ml-2 text-sm text-gray-600 truncate max-w-[150px]" title={selectedFile.name}>
                {selectedFile.name}
              </span>
            ) : (
              <span className="ml-2 text-sm text-gray-400">Ningún archivo seleccionado</span>
            )}*/}
          </div>
        </div>
      </div>

      {selectedFile && (
        <div className="mb-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Archivo seleccionado: <strong>{selectedFile.name}</strong>
            </span>
            <button
              onClick={handleUpload}
              disabled={uploadDisabled}
              className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                uploadDisabled
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary-dark focus:ring-primary'
              }`}
            >
              {isUploading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Subiendo...
                </span>
              ) : (
                'Cargar'
              )}
            </button>
          </div>
          {hasProcessingJob && !isUploading && (
            <p className="text-sm text-yellow-600 mt-2">
              ⚠️ Hay un job en proceso. Espera a que termine antes de subir otro archivo.
            </p>
          )}
        </div>
      )}
      </div>

      {currentJobId && (
        <BulkUploadProgress
          status={jobStatus.status}
          totalFiles={jobStatus.totalFiles}
          processed={jobStatus.processed}
          failed={jobStatus.failed}
          progressPercent={jobStatus.progressPercent}
          errors={jobStatus.errors}
          isActive={jobStatus.isActive}
          onClose={handleCloseProgress}
        />
      )}

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Jobs recientes</h3>
        
        {recentJobs.isLoading && (
          <div className="flex items-center justify-center py-8">
            <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="ml-3 text-gray-600">Cargando jobs...</span>
          </div>
        )}

        {recentJobs.isError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">
              Error al cargar jobs: {recentJobs.error?.message || 'Error desconocido'}
            </p>
          </div>
        )}

        {!recentJobs.isLoading && !recentJobs.isError && recentJobs.data?.jobs?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No hay jobs recientes</p>
          </div>
        )}

        {!recentJobs.isLoading && !recentJobs.isError && recentJobs.data?.jobs?.length > 0 && (
          <div className="space-y-3">
            {recentJobs.data.jobs.slice(0, 5).map((job) => (
              <div
                key={job.jobId}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  currentJobId === job.jobId 
                    ? 'bg-blue-100 border-2 border-blue-500' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setCurrentJobId(job.jobId)}
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium text-white ${
                    job.status === 'COMPLETED' ? 'bg-green-500' :
                    job.status === 'FAILED' ? 'bg-red-500' :
                    job.status === 'PROCESSING' ? 'bg-blue-500' : 'bg-yellow-500'
                  }`}>
                    {job.status}
                  </span>
                  <span className="text-sm text-gray-600">
                    {job.processed}/{job.totalFiles} archivos
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(job.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountStatementForm;