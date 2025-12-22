import React from 'react';

const FacilityFilters = ({ filters, onFilterChange, onDateChange }) => {
  const handleStatusChange = status => {
    onFilterChange({ status });
  };

  const handleTypeChange = type => {
    onFilterChange({ type });
  };

  const statusOptions = [
    { value: '', label: 'Todas' },
    { value: 'ACTIVE', label: 'Activas' },
    { value: 'INACTIVE', label: 'Inactivas' },
    { value: 'MAINTENANCE', label: 'En mantenimiento' },
  ];

  const typeOptions = [
    { value: '', label: 'Todos' },
    { value: 'PADEL', label: 'Padel' },
    { value: 'TENNIS', label: 'Tennis' },
    { value: 'GYM', label: 'Gimnasio' },
    { value: 'OTHER', label: 'Otro' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estatus</label>
          <div className="flex space-x-2">
            {statusOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                className={`px-3 py-2 text-sm rounded-md border ${
                  filters.status === option.value
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input
            type="text"
            value={filters.search || ''}
            onChange={e => onFilterChange({ search: e.target.value })}
            placeholder="Buscar instalaciones..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <div className="flex space-x-2">
            {typeOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleTypeChange(option.value)}
                className={`px-3 py-2 text-sm rounded-md border ${
                  filters.type === option.value
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <input
            type="date"
            value={filters.date || ''}
            onChange={e => onDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default FacilityFilters;
