import React, { useState, useCallback, useContext, useEffect, useRef } from 'react';
import { useBulkUploadMutation, useRecentBulkJobs } from '../../hooks/useBulkUploadJob';
import { AppContext } from '../../../../shared/context/AppContext';
import MultiBatchProgress from '../MultiBatchProgress';
import { splitZipIntoBatches } from '../../utils/splitZipIntoBatches';
import { accountStatementService } from '../../services';

const AccountStatementForm = () => {
  const { addLog, addToast } = useContext(AppContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [batchPreview, setBatchPreview] = useState(null); // { totalFiles, batchCount }
  const [analyzing, setAnalyzing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [batchJobs, setBatchJobs] = useState([]); // [{ jobId, fileCount, finalStatus }]
  const pollingRefs = useRef({});

  const uploadMutation = useBulkUploadMutation();
  const recentJobs = useRecentBulkJobs();

  const hasProcessingJob = recentJobs.data?.jobs?.some(
    job => job.status === 'PROCESSING' || job.status === 'PENDING'
  ) || false;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.zip')) {
      addToast('Error: Por favor sube un archivo ZIP válido', 'error');
      return;
    }

    setSelectedFile(file);
    setBatchPreview(null);
    setAnalyzing(true);
    addLog(`Archivo ZIP seleccionado: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)`);

    try {
      const { totalFiles, batchSizes } = await splitZipIntoBatches(file);
      setBatchPreview({ totalFiles, batchCount: batchSizes.length, batchSizes });
      addLog(`Análisis: ${totalFiles} PDFs → ${batchSizes.length} batch(es) de [${batchSizes.join(', ')}] archivos`);
    } catch (err) {
      addToast(`Error analizando ZIP: ${err.message}`, 'error');
      setSelectedFile(null);
      e.target.value = '';
    } finally {
      setAnalyzing(false);
    }
  };

  const pollJobUntilDone = useCallback((jobId, batchIndex) => {
    const interval = setInterval(async () => {
      try {
        const status = await accountStatementService.getJobStatus(jobId);
        if (status.status === 'COMPLETED' || status.status === 'FAILED') {
          clearInterval(interval);
          delete pollingRefs.current[jobId];
          setBatchJobs(prev =>
            prev.map(b => b.jobId === jobId ? { ...b, finalStatus: status.status } : b)
          );
          addLog(`Batch ${batchIndex + 1} ${status.status === 'COMPLETED' ? 'completado' : 'falló'}: ${status.processed}/${status.totalFiles} archivos`);
        }
      } catch (_) {}
    }, 3000);
    pollingRefs.current[jobId] = interval;
  }, [addLog]);

  useEffect(() => {
    return () => {
      Object.values(pollingRefs.current).forEach(clearInterval);
    };
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setBatchJobs([]);
    addLog('Dividiendo ZIP en batches...');

    try {
      const { batches, totalFiles, batchSizes } = await splitZipIntoBatches(selectedFile);
      addLog(`${batches.length} batch(es) listos para subir en paralelo`);

      const uploadResults = await Promise.allSettled(
        batches.map((batchFile, index) =>
          accountStatementService.uploadAccountStatements(batchFile).then(result => ({ result, index }))
        )
      );

      const jobs = [];
      for (const settled of uploadResults) {
        if (settled.status === 'fulfilled') {
          const { result, index } = settled.value;
          if (result.success && result.data?.jobId) {
            jobs.push({ jobId: result.data.jobId, fileCount: batchSizes[index], finalStatus: null });
            addLog(`Batch ${index + 1} subido → Job ID: ${result.data.jobId}`);
          } else {
            addLog(`Error en batch ${settled.value.index + 1}: ${result.error || 'Error desconocido'}`);
          }
        } else {
          addLog(`Error al subir un batch: ${settled.reason?.message}`);
        }
      }

      if (jobs.length === 0) {
        addToast('No se pudo iniciar ningún job de procesamiento', 'error');
        return;
      }

      setBatchJobs(jobs);
      addToast(`${jobs.length} batch(es) en proceso. Puedes ver el progreso abajo.`, 'success');

      jobs.forEach((job, index) => pollJobUntilDone(job.jobId, index));

      setSelectedFile(null);
      setBatchPreview(null);
      const fileInput = document.getElementById('file-input-account-statement');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      addLog(`Error: ${error.message}`);
      addToast(error.message || 'Error al procesar el archivo', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleCloseProgress = () => {
    Object.values(pollingRefs.current).forEach(clearInterval);
    pollingRefs.current = {};
    setBatchJobs([]);
  };

  const uploadDisabled = uploading || analyzing || hasProcessingJob;

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
              <span className="text-gray-400 font-normal ml-1">(se divide automáticamente en lotes)</span>
            </label>
            <input
              id="file-input-account-statement"
              type="file"
              accept=".zip"
              onChange={handleFileUpload}
              disabled={uploading || analyzing}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary/10 file:text-primary
                hover:file:bg-primary/20
                disabled:opacity-50"
            />
          </div>
        </div>

        {analyzing && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <svg className="animate-spin h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Analizando ZIP...
          </div>
        )}

        {selectedFile && batchPreview && !analyzing && (
          <div className="mb-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-3">
              <p className="text-sm text-blue-800 font-medium">
                📦 {batchPreview.totalFiles} PDFs detectados
                → se procesarán en <strong>{batchPreview.batchCount} batch{batchPreview.batchCount > 1 ? 'es' : ''}</strong> en paralelo
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Distribución: [{batchPreview.batchSizes.join(', ')}] archivos por batch
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024 / 1024).toFixed(1)} MB)
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
                {uploading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Subiendo batches...
                  </span>
                ) : (
                  `Cargar ${batchPreview.batchCount} batch${batchPreview.batchCount > 1 ? 'es' : ''}`
                )}
              </button>
            </div>
            {hasProcessingJob && !uploading && (
              <p className="text-sm text-yellow-600 mt-2">
                ⚠️ Hay un job en proceso. Espera a que termine antes de subir otro archivo.
              </p>
            )}
          </div>
        )}
      </div>

      {batchJobs.length > 0 && (
        <MultiBatchProgress
          batchJobs={batchJobs}
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
            {recentJobs.data.jobs.slice(0, 10).map((job) => (
              <div
                key={job.jobId}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
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