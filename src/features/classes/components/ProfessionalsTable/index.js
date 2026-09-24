import React from 'react';

/**
 * Listado de profesionales.
 *
 * Muestra también los inactivos, en gris: el Club necesita poder reactivarlos, y
 * un profesional nunca se borra porque su historial de clases se conserva (§11).
 */
const ProfessionalsTable = ({ professionals, loading, onEdit, onToggleActive, onManageSchedule }) => {
  if (loading) {
    return <div className="py-10 text-center text-gray-500">Cargando profesionales...</div>;
  }

  if (professionals.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500 bg-gray-50 rounded-lg">
        Aún no hay profesionales dados de alta
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Profesional
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Disciplina
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Horarios
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {professionals.map((professional) => (
            <tr key={professional.id} className={professional.active ? '' : 'bg-gray-50'}>
              <td className="px-6 py-4">
                <div className={`font-medium ${professional.active ? 'text-gray-900' : 'text-gray-400'}`}>
                  {professional.displayName}
                </div>
                {professional.shortBio && (
                  <div className="text-sm text-gray-500">{professional.shortBio}</div>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{professional.discipline?.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {professional._count?.schedules ?? 0} bloques
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    professional.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {professional.active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-6 py-4 text-right text-sm space-x-3 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => onManageSchedule(professional)}
                  className="text-emerald-600 hover:text-emerald-800"
                >
                  Horarios
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(professional)}
                  className="text-emerald-600 hover:text-emerald-800"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => onToggleActive(professional)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {professional.active ? 'Desactivar' : 'Activar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfessionalsTable;
