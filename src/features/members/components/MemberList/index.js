import React, { useState, useContext, useEffect } from 'react';
import MemberFilters from '../MemberFilters';
import IndividualMember from '../../../individual-members';
import MemberDocuments from '../../../member-documents';
import { useMembers } from '../../hooks/useMembers';
import { memberService } from '../../services';
import { memberService as individualMemberService } from '../../../individual-members/services';
import BulkMemberUploadContainer from '../../../bulk-upload';
import { AppContext } from '../../../../shared/context/AppContext';

const MemberList = () => {
  const [filters, setFilters] = useState({
    active: true, // Default to showing active members first
    search: ''
  });
  const [editingMember, setEditingMember] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isAddingDependent, setIsAddingDependent] = useState(false);
  const [showDependents, setShowDependents] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0 });
  const { addToast } = useContext(AppContext);

  const { members, setMembers, meta, page, setPage, loadMembers, setActive, search, setSearch, loading } = useMembers();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (dropdownOpen) {
        setDropdownOpen(null);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [dropdownOpen]);

  const handleToggleActive = async (member) => {
    const newActive = !filters.active;
    const payload = { active: newActive };

    setMembers(prev =>
      prev.map(m =>
        m.id === member.id
          ? { ...m, user: { ...m.user, active: newActive } }
          : m
      )
    );

    try {
      const result = await individualMemberService.updateMember(member.user.id, payload);

      if (!result.success) {
        setMembers(prev =>
          prev.map(m =>
            m.id === member.id
              ? { ...m, user: { ...m.user, active: !newActive } }
              : m
          )
        );
        addToast(result.error || 'Error al actualizar estatus del socio', 'error');
        return;
      }

      addToast(
        newActive ? 'Socio activado correctamente' : 'Socio desactivado correctamente',
        'success',
      );
      loadMembers();
    } catch (error) {
      setMembers(prev =>
        prev.map(m =>
          m.id === member.id
            ? { ...m, user: { ...m.user, active: !newActive } }
            : m
        )
      );
      addToast('Error al actualizar estatus del socio', 'error');
    } finally {
      setDropdownOpen(null);
      setShowConfirmationModal(false);
    }
  };

  const filteredMembers = members;

  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    if (newFilters.search !== undefined) {
      setSearch(newFilters.search);
      setPage(1);
    }
    if (newFilters.active !== undefined) {
      setActive(newFilters.active);
      setPage(1);
    }
  };

  const handleFormMember = (member = null) => {
    console.log('handleFormMember called with member:', member);
    setEditingMember(member);
    setIsAddingDependent(false); // Estamos editando, no agregando dependiente
    setShowForm(true);
    setDropdownOpen(null);
  };

  const handleAddDependent = (member) => {
    console.log('handleAddDependent called with member:', member);
    setEditingMember(member);
    setIsAddingDependent(true);
    setShowForm(true);
    setDropdownOpen(null);
  };

  const handleViewDependents = (member) => {
    setEditingMember(member);
    setShowDependents(true);
    setDropdownOpen(null);
  };

  const handleMemberDocuments = (member) => {
    console.log('handleMemberDocuments called with member:', member);
    // Mostrar pantalla de documentos del socio
    setEditingMember(member);
    setShowForm('documents'); // Nuevo estado para mostrar documentos
    setDropdownOpen(null);
  };

  const handleBulkMember = () => {
    setShowBulkForm(true);
    setDropdownOpen(null);
  };

  const handleDeleteMember = async (memberId) => {
    const prevMembers = members;
    setMembers(prev => prev.filter(m => m.id !== memberId));

    const result = await memberService.deleteMember(memberId);
    if (!result.success) {
      setMembers(prevMembers);
      addToast(result.error || 'Error al eliminar miembro', 'error');
      return;
    }

    addToast('Socio eliminado correctamente', 'success');
    if (prevMembers.length === 1 && page > 1) {
      setPage(page - 1);
    }
    setDropdownOpen(null);
  };

  const handleSaveMember = () => {
    loadMembers();
    setShowForm(false);
    setEditingMember(null);
  };

  const confirmAction = (action, data = null) => {
    setModalAction({ action, data });
    setShowConfirmationModal(true);
  };

  const handleConfirm = () => {
    if (modalAction) {
      if (modalAction.action === 'back' || modalAction.action === 'cancel') {
        setShowForm(false);
        setShowBulkForm(false);
        setEditingMember(null);
      } else if (modalAction.action === 'delete') {
        handleDeleteMember(modalAction.data);
      } else if (modalAction.action === 'toggleActive') {
        handleToggleActive(modalAction.data);
      }
    }
    setShowConfirmationModal(false);
    setModalAction(null);
  };

  const handleCancel = () => {
    setShowConfirmationModal(false);
    setModalAction(null);
  };

  const handleBack = () => {
    setShowForm(false);
    setShowBulkForm(false);
    setShowDependents(false);
    setEditingMember(null);
    setIsAddingDependent(false);
  };

  if (showDependents) {
    const AdminDependentsList = require('../../../dependents/AdminDependentsList').default;
    return (
      <AdminDependentsList
        memberId={editingMember?.id}
        memberName={editingMember ? `${editingMember.user?.name || ''} ${editingMember.user?.lastName || ''}`.trim() : ''}
        memberCode={editingMember?.memberCode}
        onBack={handleBack}
      />
    );
  }

  if (showForm === 'documents') {
    return (
      <MemberDocuments
        memberId={editingMember?.id}
        onBack={handleBack}
      />
    );
  }

  if (showForm === true) {
    return (
        <IndividualMember
          initialData={null} // Always pass null to trigger API fetch for editing
          onAddMember={handleSaveMember}
          onCancel={handleBack}
          loadMembers={loadMembers}
          memberId={isAddingDependent ? editingMember?.id : editingMember?.id} // ID del socio para editar o del socio principal si es dependiente
          isDependent={isAddingDependent} // Indicar si es dependiente
        />
    );
  }

  if (showBulkForm) {
    return (
        <BulkMemberUploadContainer
          onCancel={handleBack}
          onAddMember={handleSaveMember}
        />
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Socios</h1>
            <p className="text-gray-600">Gestión de socios del club</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
        {/* Filters Section */}
        <MemberFilters
          filters={filters}
          onFilterChange={updateFilters}
        />

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Members List - only show when not loading */}
        {!loading && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Lista de socios</h2>

            <div className="flex space-x-2">
              <button
                onClick={() => handleFormMember()}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar socio
              </button>

              <button
                onClick={() => handleBulkMember()}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Cargar masivamente
              </button>
            </div>
          </div>

          {filteredMembers.length === 0 ? (
            <>
              <p className="text-gray-500">No hay socios registrados con los filtros aplicados.</p>
            </>
          ) : (
            <>
              <div className="border border-gray-200 rounded-lg">
                <div className="max-h-[60vh] overflow-y-auto">
                  <div className="min-w-full overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número de acción</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellidos</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profesión</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método pago</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha admisión</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody 
                    className="bg-white divide-y divide-gray-200"
                  >
                    {filteredMembers.map((member, index) => (
                      <tr
                        key={member.id}
                        className={member.id % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                        // onClick={() => handleFormMember(member)}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{member.memberCode}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{member.user.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{member.user.lastName}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{member.user.email}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{member.title}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{member.profession}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{member.paymentMethod}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {member.dateOfAdmission ? (() => {
                            const date = new Date(member.dateOfAdmission);
                            // Check if the date is valid
                            if (isNaN(date.getTime())) return '';

                            // Extract UTC date components to avoid timezone conversion
                            const day = String(date.getUTCDate()).padStart(2, '0');
                            const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Month is 0-indexed
                            const year = date.getUTCFullYear();

                            return `${day}-${month}-${year}`;
                          })() : ''}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 relative ">
                          <div className="relative inline-block text-left">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const rect = e.target.getBoundingClientRect();
                                const top = Math.min(window.innerHeight - 200, rect.bottom + window.scrollY);
                                setDropdownPosition({ top });
                                setDropdownOpen(dropdownOpen === member.id ? null : member.id);
                              }}
                              className="text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                              </svg>
                            </button>
                            {dropdownOpen === member.id && (
                              <div 
                                className="origin-top-right fixed right-4 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 max-h-60 overflow-y-auto"
                                style={{
                                  top: `${dropdownPosition.top}px`
                                }}
                              >
                                <div className="py-1" role="menu">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewDependents(member);
                                    }}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    role="menuitem"
                                  >
                                    Ver dependientes
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleFormMember(member);
                                    }}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    role="menuitem"
                                  >
                                    Editar
                                  </button>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      confirmAction('toggleActive', member);
                                    }}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    role="menuitem"
                                  >
                                    {filters.active ? 'Desactivar' : 'Activar'}
                                  </button>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      confirmAction('delete', member.id);
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
                </div>
              </div>

          {meta && (
  <div className="flex justify-center items-center gap-2 mt-4 flex-wrap">
    {(() => {
      const totalPages = meta.totalPages;
      const maxVisiblePages = 10;
      const half = Math.floor(maxVisiblePages / 2);

      let startPage = Math.max(1, page - half);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      // Ajustar inicio si no hay suficientes páginas al final
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      return (
        <>
          {/* Anterior */}
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 rounded border text-sm disabled:text-gray-300"
          >
            Anterior
          </button>

          {/* Primera página */}
          {startPage > 1 && (
            <>
              <button
                onClick={() => setPage(1)}
                className="px-3 py-1 rounded border text-sm"
              >
                1
              </button>
              <span className="px-2">...</span>
            </>
          )}

          {/* Páginas visibles */}
          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => {
              const pageNum = startPage + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1 rounded border text-sm ${
                    page === pageNum
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  {pageNum}
                </button>
              );
            }
          )}

          {/* Última página */}
          {endPage < totalPages && (
            <>
              <span className="px-2">...</span>
              <button
                onClick={() => setPage(totalPages)}
                className="px-3 py-1 rounded border text-sm"
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Siguiente */}
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 rounded border text-sm disabled:text-gray-300"
          >
            Siguiente
          </button>
        </>
      );
    })()}
  </div>
)}
</>
          )}
          </>
        )}
      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmar acción</h3>
            <p className="text-gray-600 mb-4">
              {modalAction?.action === 'delete' && '¿Estás seguro que deseas eliminar este socio?'}
              {modalAction?.action === 'toggleActive' &&
                `¿Estás seguro que deseas ${modalAction?.data?.user?.active ? 'desactivar' : 'activar'} este socio?`}
              {modalAction?.action !== 'delete' && modalAction?.action !== 'toggleActive' &&
                ' Los cambios no guardados se perderán.'}
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
    </div>
  );
};

export default MemberList;