import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../../../../shared/context/AppContext';
import MemberFilters from '../MemberFilters';

const MemberList = () => {
  const { members } = useContext(AppContext);
  const [filters, setFilters] = useState({
    status: 'activos', // Default to showing active members first
    search: ''
  });

  // Apply filters to members
  const filteredMembers = useMemo(() => {
    let result = [...members];

    // Apply status filter
    if (filters.status) {
      if (filters.status === 'activos') {
        result = result.filter(member => member.activo);
      } else if (filters.status === 'inactivos') {
        result = result.filter(member => !member.activo);
      }
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(member =>
        member.nombre.toLowerCase().includes(searchTerm) ||
        member.apellidos.toLowerCase().includes(searchTerm) ||
        member.email.toLowerCase().includes(searchTerm) ||
        String(member.numero_socio).toLowerCase().includes(searchTerm)
      );
    }

    return result;
  }, [members, filters]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
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
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código del socio</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellidos</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profesión</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método pago</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha admisión</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <tr key={member.id} className={member.id % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{member.numero_socio}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{member.nombre}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{member.apellidos}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{member.titulo}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{member.profesion}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{member.metodo_pago}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{member.fecha_admision}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        Total de socios: {filteredMembers.length} de {members.length}
      </div>
    </div>
  );
};

export default MemberList;