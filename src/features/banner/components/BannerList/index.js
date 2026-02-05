import React from 'react';
import BannerCard from '../BannerCard';

const BannerList = ({
  banners,
  filters,
  loading,
  meta,
  page,
  setPage,
  onEdit,
  onDelete,
  onAddBanner,
  onToggleStatus
}) => {
  if (loading && banners.length === 0) {
    // Show a skeleton loading state when loading and no banners are displayed yet
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Lista de banners</h2>
          <button
            onClick={onAddBanner}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Agregar banner
          </button>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Lista de banners</h2>
        <button
          onClick={onAddBanner}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Agregar banner
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
          {banners && Array.isArray(banners) && banners.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h3 className="text-lg font-medium text-gray-800 mb-1">No hay banners</h3>
              <p className="text-gray-500">No se han subido banners con los filtros aplicados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {banners && Array.isArray(banners) && banners.map(banner => (
                <BannerCard
                  key={banner.id}
                  banner={banner}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleStatus={onToggleStatus}
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
    </div>
  );
};

export default BannerList;