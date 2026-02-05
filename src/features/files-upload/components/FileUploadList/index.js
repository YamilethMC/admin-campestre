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
  onAddFile 
}) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  const handleDeleteClick = (file) => {
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
        <FileUploadFilters
          search={search}
          onSearchChange={setSearch}
        />
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <FileUploadFilters
        search={search}
        onSearchChange={setSearch}
      />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Lista de documentos</h2>
        <button
          onClick={onAddFile}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Subir archivo
        </button>
      </div>

      {/* Show loading indicator when loading, hiding existing data */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Only show content when not loading */}
      {!loading && (
        <>
          {files.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h3 className="text-lg font-medium text-gray-800 mb-1">No se han subido archivos</h3>
              <p className="text-gray-500">No hay documentos disponibles con los filtros aplicados</p>
            </div>
          ) : (
            <div>
              {files.map(file => (
                <FileCard
                  key={file.id}
                  file={file}
                  onEdit={onEdit}
                  onDelete={handleDeleteClick}
                />
              ))}

              {/* Pagination controls */}
              {meta && (
                <div className="flex justify-center items-center gap-3 mt-4">
                  {/* Calculate total pages and set up sliding window */}
                  {(() => {
                    const totalPages = meta.totalPages;
                    const maxVisiblePages = 5;
                    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
                    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                    // Adjust start if range exceeds total pages
                    if (endPage - startPage + 1 < maxVisiblePages) {
                      startPage = Math.max(1, endPage - maxVisiblePages + 1);
                    }

                    return (
                      <>
                        {/* Previous button */}
                        <button
                          disabled={page === 1}
                          onClick={() => setPage(page - 1)}
                          className={`px-3 py-1 rounded border text-sm ${
                            page === 1 ? 'text-gray-300 border-gray-200' : 'text-primary border-primary'
                          }`}
                        >
                          Anterior
                        </button>

                        {/* Visible page buttons */}
                        {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                          const pageNum = startPage + i;
                          return (
                            <button
                              key={`page-${pageNum}`}
                              onClick={() => setPage(pageNum)}
                              className={`px-3 py-1 rounded border text-sm ${
                                page === pageNum ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-700'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        {/* Next button */}
                        <button
                          disabled={page === totalPages}
                          onClick={() => setPage(page + 1)}
                          className={`px-3 py-1 rounded border text-sm ${
                            page === totalPages ? 'text-gray-300 border-gray-200' : 'text-primary border-primary'
                          }`}
                        >
                          Siguiente
                        </button>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && fileToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmar eliminación</h3>
            <p className="text-gray-600 mb-4">
              ¿Estás seguro que deseas eliminar el archivo "{fileToDelete.name}"? Esta acción no se puede deshacer.
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