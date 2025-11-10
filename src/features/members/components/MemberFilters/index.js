import React from 'react';

const MemberFilters = ({ filters, onFilterChange }) => {
  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Status Filter - 1/4 of the screen */}
        <div className="md:w-1/4 space-y-3 flex-shrink-0">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Estatus</h3>
          <div className="flex flex-wrap gap-2">
            <button
              key="activos"
              onClick={() => onFilterChange({ ...filters, active: true })}
              className={`px-3 py-2 rounded-md border text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                filters.active === true
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              Activos
            </button>
            <button
              key="inactivos"
              onClick={() => onFilterChange({ ...filters, active: false })}
              className={`px-3 py-2 rounded-md border text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                filters.active === false
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              Inactivos
            </button>
          </div>
        </div>

        {/* Empty space - 1/4 of the screen */}
        <div className="md:w-1/4 flex-shrink-0 invisible md:visible">
          {/* This div creates empty space - only visible on medium screens and larger */}
        </div>

        {/* Search Filter - 2/4 (1/2) of the screen */}
        <div className="md:w-1/2 flex-1">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide invisible md:visible">Buscar</h3>
          <input
            type="text"
            placeholder="Buscar socios..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default MemberFilters;