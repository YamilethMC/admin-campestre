import React, { useState, useMemo, useEffect } from 'react';
import MemberFilters from '../MemberFilters';
import IndividualMemberForm from '../../../individual-members/components/IndividualMemberForm';
import { useMembers } from '../../hooks/useMembers';
import { memberService } from '../../services';

const MemberList = () => {
  const [filters, setFilters] = useState({
    active: true, // Default to showing active members first
    search: ''
  });
  const [editingMember, setEditingMember] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const { members, meta, loadMembers, setActive } = useMembers();

  useEffect(() => {
    loadMembers({ active: filters.active, search: filters.search });
  }, [filters.active, filters.search]);

  // Apply filters to members
  const filteredMembers = useMemo(() => {
    let result = [...members];

    // Apply status filter
    /*if (filters.status === 'activos') {
      result = result.filter(member => member.activo);
    } else if (filters.status === 'inactivos') {
      result = result.filter(member => !member.activo);
    }*/

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(member =>
        member.user.name.toLowerCase().includes(searchTerm) ||
        member.user.lastName.toLowerCase().includes(searchTerm) ||
        member.user.email.toLowerCase().includes(searchTerm) ||
        String(member.memberCode).toLowerCase().includes(searchTerm)
      );
    }

    return result;
  }, [members, filters]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    if (newFilters.active !== undefined) {
    setActive(newFilters.active);
    loadMembers({ active: newFilters.active });
  }
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setShowForm(true);
    setDropdownOpen(null); // Close any open dropdowns
  };

  const handleDeleteMember = async (memberId) => {
    await memberService.deleteMember(memberId);
    loadMembers();
    setDropdownOpen(null); // Close the dropdown
  };

  const handleSaveMember = (memberData) => {
    if (editingMember) {
      // Update existing member
      loadMembers();
    } else {
      // Add new member - this would be for creating new members
      // For now, we're only handling edits
    }
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
        setEditingMember(null);
      } else if (modalAction.action === 'delete') {
        handleDeleteMember(modalAction.data);
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
    confirmAction('back');
  };

  if (showForm) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
        <div className="mb-4">
          <button
            onClick={handleBack}
            className="flex items-center text-primary hover:text-primary-dark font-medium"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Regresar
          </button>
        </div>
        <IndividualMemberForm 
          initialData={editingMember} 
          onAddMember={handleSaveMember}
          onCancel={handleBack}
        />
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
      {/* Filters Section */}
      <MemberFilters
        filters={filters}
        onFilterChange={updateFilters}
      />

      {/* Members List */}
      <h2 className="text-xl font-semibold mb-4 text-primary">Lista de socios</h2>

      {filteredMembers.length === 0 ? (
        <p className="text-gray-500">No hay socios registrados con los filtros aplicados.</p>
      ) : (
        <div className="border border-gray-200 rounded-lg">
          <div className="">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
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
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className={member.id % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{member.memberCode}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{member.user.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{member.user.lastName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{member.user.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{member.title}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{member.profession}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{member.paymentMethod}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{member.dateOfAdmission}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="relative">
                        <button
                          onClick={() => setDropdownOpen(dropdownOpen === member.id ? null : member.id)}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                        {dropdownOpen === member.id && (
                          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                            <div className="py-1" role="menu">
                              <button
                                onClick={() => handleEditMember(member)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                role="menuitem"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => {
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
      )}

      <div className="mt-4 text-sm text-gray-600">
        Total de socios: {filteredMembers.length} de {members.length}
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmar acción</h3>
            <p className="text-gray-600 mb-4">
              ¿Estás seguro que deseas {modalAction?.action === 'delete' ? 'eliminar' : modalAction?.action === 'back' ? 'regresar' : 'cancelar'}?
              {modalAction?.action !== 'delete' && ' Los cambios no guardados se perderán.'}
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

export default MemberList;