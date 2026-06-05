import React from 'react';
import { useBulkUploadJobStatus } from '../../hooks/useBulkUploadJob';

const STATUS_LABELS = {
  PENDING: 'En cola',
  PROCESSING: 'Procesando',
  COMPLETED: 'Completado',
  FAILED: 'Fallido',
};

const STATUS_COLORS = {
  PENDING: 'bg-yellow-500',
  PROCESSING: 'bg-blue-500',
  COMPLETED: 'bg-green-500',
  FAILED: 'bg-red-500',
};

const BatchRow = ({ jobId, batchNumber, fileCount }) => {
  const job = useBulkUploadJobStatus(jobId);
  const status = job.status || 'PENDING';
  const progress = job.progressPercent || 0;
  const processed = job.processed || 0;
  const total = job.totalFiles || fileCount || '?';

  return (
    <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Batch {batchNumber}</span>
          <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${STATUS_COLORS[status] || 'bg-gray-400'}`}>
            {STATUS_LABELS[status] || status}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {processed}/{total} archivos
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            status === 'COMPLETED' ? 'bg-green-500' :
            status === 'FAILED' ? 'bg-red-500' : 'bg-blue-500'
          }`}
          style={{ width: `${status === 'COMPLETED' ? 100 : progress}%` }}
        />
      </div>

      {job.errors?.length > 0 && (
        <details className="mt-1">
          <summary className="text-xs text-red-600 cursor-pointer">
            {job.errors.length} error(es)
          </summary>
          <ul className="mt-1 text-xs text-red-500 space-y-0.5 max-h-20 overflow-y-auto">
            {job.errors.slice(0, 5).map((err, i) => (
              <li key={i} className="truncate">{err}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
};

const MultiBatchProgress = ({ batchJobs, onClose }) => {
  if (!batchJobs || batchJobs.length === 0) return null;

  const allCompleted = batchJobs.every(b => b.finalStatus === 'COMPLETED');
  const anyFailed = batchJobs.some(b => b.finalStatus === 'FAILED');
  const allDone = batchJobs.every(b => b.finalStatus === 'COMPLETED' || b.finalStatus === 'FAILED');

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Procesamiento en curso — {batchJobs.length} batch{batchJobs.length > 1 ? 'es' : ''}
        </h3>
        {allDone && onClose && (
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Cerrar
          </button>
        )}
      </div>

      <div className="space-y-3">
        {batchJobs.map((batch, index) => (
          <BatchRow
            key={batch.jobId}
            jobId={batch.jobId}
            batchNumber={index + 1}
            fileCount={batch.fileCount}
          />
        ))}
      </div>

      {allDone && (
        <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${
          allCompleted ? 'bg-green-50 text-green-700 border border-green-200' :
          anyFailed ? 'bg-red-50 text-red-700 border border-red-200' :
          'bg-yellow-50 text-yellow-700 border border-yellow-200'
        }`}>
          {allCompleted
            ? '✅ Todos los batches se procesaron correctamente.'
            : `⚠️ Procesamiento terminado con errores en algunos batches.`}
        </div>
      )}
    </div>
  );
};

export default MultiBatchProgress;
