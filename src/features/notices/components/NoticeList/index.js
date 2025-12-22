import React from 'react';
import NoticeCard from '../NoticeCard';

const NoticeList = ({
  notices,
  filters,
  loading,
  meta,
  page,
  setPage,
  onEdit,
  onToggleStatus,
  onDelete,
  onAddNotice,
}) => {
  if (loading && notices.length === 0) {
    // Show a skeleton loading state when loading and no notices are displayed yet
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Lista de avisos</h2>
          <button
            onClick={onAddNotice}
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
            Agregar aviso
          </button>
        </div>
        <div className="space-y-4">
          {/* Skeleton loading cards */}
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="h-8 bg-gray-200 rounded w-1/5"></div>
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Lista de avisos</h2>
        <button
          onClick={onAddNotice}
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
          Agregar aviso
        </button>
      </div>

      {notices.length === 0 ? (
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-800 mb-1">No hay avisos</h3>
          <p className="text-gray-500">No se han subido avisos con los filtros aplicados</p>
        </div>
      ) : (
        <div>
          {notices.map(notice => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              onEdit={onEdit}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
            />
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
    </div>
  );
};

export default NoticeList;
