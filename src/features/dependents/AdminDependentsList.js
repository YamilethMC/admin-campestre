import React, { useState, useEffect, useCallback, useContext } from 'react';
import AdminDependentDetail from './AdminDependentDetail';
import { AppContext } from '../../shared/context/AppContext';
import { handleAuthError } from '../../shared/utils/authErrorHandler';
import { useDebounce } from '../../shared/hooks/useDebounce';

const RELATIONSHIP_LABELS = {
  SPOUSE: 'Cónyuge',
  CHILD: 'Hijo/a',
  WIFE: 'Esposa',
  HUSBAND: 'Esposo',
  SON: 'Hijo',
  DAUGHTER: 'Hija',
};

const AdminDependentsList = ({ memberId, memberName, memberCode, onBack }) => {
  const [dependents, setDependents] = useState([]);
  const [meta, setMeta] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDependentId, setSelectedDependentId] = useState(null);
  const { addToast } = useContext(AppContext);
  const debouncedSearch = useDebounce(search, 1000);
  const [modalAction, setModalAction] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const getToken = () => localStorage.getItem('authToken');
  const fetchDependents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/dependents/member/${memberId}?page=${currentPage}&limit=20&search=${search}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      if (!res.ok) {
        if (res.status === 401) {
          // Llamar a la función global para manejar el error de autenticación
          handleAuthError();
          return {
            success: false,
            error: 'No autorizado: Sesión expirada',
            status: res.status
          };
        }
        let errorMessage = "Error al obtener dependientes";
        switch (res.status) {
          case 400:
            errorMessage = 'Datos de entrada inválidos';
            break;
          case 404:
            errorMessage = 'No se encontraron dependientes para este socio';
            break;
          case 500:
            errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
            break;
          default:
            errorMessage = res.data?.message || "Error al obtener dependientes";
        }

        addToast(errorMessage, 'error');
      }

      const data = await res.json();
      setDependents(data.data.dependents || []);
      setMeta(data.data.meta || {});
      setTotalPages(data.data.meta?.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Error inesperado al cargar dependientes');
    } finally {
      setLoading(false);
    }
  }, [memberId, currentPage, search]);

  useEffect(() => {
    if (memberId) fetchDependents();
  }, [memberId, currentPage, debouncedSearch]);

  const handleDependentApproved = () => {
    setSelectedDependentId(null);
    fetchDependents();
  };

  const handleDependentRejected = () => {
    setSelectedDependentId(null);
    fetchDependents();
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const confirmAction = (action, data = null) => {
    setModalAction({ action, data });
    setShowConfirmationModal(true);
  };

  const handleCancel = () => {
    setShowConfirmationModal(false);
    setModalAction(null);
  };

  const handleConfirm = () => {
    if (modalAction) {
      if (modalAction.action === 'delete') {
        handleDeleteDependent(modalAction.data);
      }
    }
    setShowConfirmationModal(false);
    setModalAction(null);
  };

  const handleDeleteDependent = async (depId) => {
    const prevDependents = dependents;
    setDependents(prev => prev.filter(d => d.id !== depId));

    const result = await fetch(
      `${process.env.REACT_APP_API_URL}/dependents/${depId}`,
      { 
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` } 
      }
    );
    if (!result.ok) {
      setDependents(prevDependents);
      if (result.status === 401) {
        // Llamar a la función global para manejar el error de autenticación
        handleAuthError();
        return {
          success: false,
          error: 'No autorizado: Sesión expirada',
          status: result.status
        };
      }
      let errorMessage = "Error al eliminar dependiente";
      switch (result.status) {
        case 400:
          errorMessage = 'Datos de entrada inválidos';
          break;
        case 404:
          errorMessage = 'Dependiente no encontrado';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = result.data?.message || "Error al eliminar dependiente";
      }
      addToast(errorMessage, 'error');
    }

    if (prevDependents.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    setDropdownOpen(null);
  };

  if (selectedDependentId) {
    return (
      <AdminDependentDetail
        dependentId={selectedDependentId}
        onBack={() => setSelectedDependentId(null)}
        onApproved={handleDependentApproved}
        onRejected={handleDependentRejected}
      />
    );
  }

  const pendingCount = dependents.filter((d) => !d.memberCode).length;

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dependientes</h1>
              <p className="text-gray-600 text-sm">
                Socio: <span className="font-medium">{memberName}</span>
                {memberCode && <span className="ml-1 text-gray-400">(#{memberCode})</span>}
              </p>
            </div>
          </div>
          {pendingCount > 0 && (
            <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-sm font-medium px-3 py-1 rounded-full">
              🔴 {pendingCount} pendiente{pendingCount > 1 ? 's' : ''} de validación
            </span>
          )}
        </div>
      </div>
      
      {/*<div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Buscar dependientes..."
          value={search || ''}
          onChange={handleSearchChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
        />
      </div>*/}

      {/* Content */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-medium">Error al cargar dependientes</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={fetchDependents}
              className="mt-2 text-sm text-red-700 underline hover:no-underline"
            >
              Reintentar
            </button>
          </div>
        ) : dependents.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-gray-500">Este socio no tiene dependientes registrados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 mb-6 mt-6">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Relación</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edad</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Núm. Socio</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dependents.map((dep, index) => (
                  <tr
                    key={dep.id}
                    className={!dep.memberCode ? 'bg-yellow-50' : 'bg-white'}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 overflow-hidden flex-shrink-0">
                          {dep.user?.profilePhotoUrl ? (
                            <img src={dep.user.profilePhotoUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            (dep.user?.name?.[0] || '?').toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {dep.user?.name} {dep.user?.lastName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {RELATIONSHIP_LABELS[dep.relationship] || dep.relationship}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {dep.user?.email || '—'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {dep.ageStatus ? `${dep.ageStatus.age} años` : '—'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {dep.memberCode ? (
                        <span className="text-sm font-medium text-gray-900">#{dep.memberCode}</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                          🔴 Sin asignar
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {dep.relationshipDocumentUrl ? (
                        <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          ✓ Subido
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                          ⚠ Pendiente
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {dep.memberCode ? (
                        <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          ✓ Aprobado
                        </span>
                      ) : dep.isDependentActive === false ? (
                        <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                          ✗ Rechazado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                          ⏳ Pendiente
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() => setDropdownOpen(dropdownOpen === dep.id ? null : dep.id)}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                        {dropdownOpen === dep.id && (
                          <div className={`origin-top-right absolute right-0 ${index === 0 ? 'top-full mt-2' : 'bottom-full mb-2'} w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 max-h-60 overflow-y-auto`}>
                            <div className="py-1" role="menu">
                              <button
                                onClick={() => {
                                  setSelectedDependentId(dep.id);
                                  setDropdownOpen(null);
                                }}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                role="menuitem"
                              >
                                Ver detalle
                              </button>
                              <button
                                onClick={() => {
                                  confirmAction('delete', dep.id);
                                  setDropdownOpen(null);
                                }}
                                className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                role="menuitem"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Pagination */}
      {/*{totalPages > 1 && ( */}
      {meta && (
        <div className="flex justify-center items-center gap-3 mt-4">
          {(() => {
            const totalPages = meta.totalPages;
            const maxVisiblePages = 5;
            let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

            // Adjust start if range exceeds total pages
            if (endPage - startPage + 1 < maxVisiblePages) {
              startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }

            return (
              <>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded border text-sm ${
                      currentPage === 1 ? 'text-gray-300 border-gray-200' : 'text-primary border-primary'
                    }`}
                  >
                  Anterior
                </button>
                {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                  const pageNum = startPage + i;
                  return (
                    <button
                      key={`page-${pageNum}`}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded border text-sm ${
                        currentPage === pageNum ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded border text-sm ${
                      currentPage === totalPages ? 'text-gray-300 border-gray-200' : 'text-primary border-primary'
                    }`}
                  >
                  Siguiente
                </button>
              </>
            );
          })()}
        </div>
      )}


      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmar acción</h3>
            <p className="text-gray-600 mb-4">
              {modalAction?.action === 'delete' && '¿Estás seguro que deseas eliminar este dependiente?'}
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
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                onClick={handleConfirm}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDependentsList;
