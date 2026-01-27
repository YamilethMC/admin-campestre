import React from 'react';

const FiltersBar = ({ filters, onFilterChange, onClearFilters }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Estado:</label>
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm"
        >
          <option value="">Todos</option>
          <option value="NOT_STARTED">No iniciado</option>
          <option value="PARTIAL">Parcial</option>
          <option value="IN_REVIEW">En revisión</option>
          <option value="APPROVED">Aprobado</option>
          <option value="REJECTED">Rechazado</option>
        </select>
      </div>
      
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Buscar:</label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          placeholder="Nombre, apellido, código..."
          className="px-3 py-1 border border-gray-300 rounded-md text-sm"
        />
      </div>

      <button
        onClick={onClearFilters}
        className="ml-auto text-sm text-blue-600 hover:text-blue-800"
      >
        Limpiar filtros
      </button>
    </div>
  );
};

export default FiltersBar;
