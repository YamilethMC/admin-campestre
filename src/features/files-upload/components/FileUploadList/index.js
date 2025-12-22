import React, { useState } from 'react';
import FileCard from '../FileCard';
import FileUploadFilters from '../FileUploadFilters';

const FileUploadList = ({
  files,
  loading,
  meta,
  page,
  setPage,
  search,
  setSearch,
  onEdit,
  onDelete,
  onAddFile,
}) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  const handleDeleteClick = file => {
    setFileToDelete(file);
    setShowConfirmationModal(true);
  };

  const handleConfirmDelete = () => {
    if (fileToDelete) {
      onDelete(fileToDelete.id);
      setShowConfirmationModal(false);
      setFileToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmationModal(false);
    setFileToDelete(null);
  };

  if (loading && files.length === 0) {
    // Show a skeleton loading state when loading and no files are displayed yet
    return (
      <div>
        <FileUploadFilters search={search} onSearchChange={setSearch} />
        <div className="space-y-4">
          {/* Skeleton loading cards */}
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-1/5"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <FileUploadFilters search={search} onSearchChange={setSearch} />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Lista de documentos</h2>
        <button
          onClick={onAddFile}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Subir archivo
        </button>
      </div>

      {files.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-800 mb-1">No se han subido archivos</h3>
          <p className="text-gray-500">No hay documentos disponibles con los filtros aplicados</p>
        </div>
      ) : (
        <div>
          {files.map(file => (
            <FileCard key={file.id} file={file} onEdit={onEdit} onDelete={handleDeleteClick} />
          ))}

          {/* Pagination controls */}
          {meta && (
            <div className="flex justify-center items-center gap-3 mt-4">
              {/* Botón Anterior */}
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className={`px-3 py-1 rounded border text-sm ${
                  page === 1 ? 'text-gray-300 border-gray-200' : 'text-primary border-primary'
                }`}
              >
                Anterior
              </button>

              {/* Botones numerados */}
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`px-3 py-1 rounded border text-sm ${
                    page === num
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  {num}
                </button>
              ))}

              {/* Botón Siguiente */}
              <button
                disabled={page === meta.totalPages}
                onClick={() => setPage(page + 1)}
                className={`px-3 py-1 rounded border text-sm ${
                  page === meta.totalPages
                    ? 'text-gray-300 border-gray-200'
                    : 'text-primary border-primary'
                }`}
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && fileToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmar eliminación</h3>
            <p className="text-gray-600 mb-4">
              ¿Estás seguro que deseas eliminar el archivo "{fileToDelete.name}"? Esta acción no se
              puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                onClick={handleCancelDelete}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                onClick={handleConfirmDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadList;
