import React from 'react';
import { SurveyCategory, SurveyStatus } from '../../interfaces';

const SurveyFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Filter */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Categoría</h3>
          <div className="flex flex-wrap gap-2">
            {/* "Todas" as the first option */}
            <button
              key="Todas"
              onClick={() => onFilterChange({ ...filters, category: 'Todas' })}
              className={`px-4 py-2 rounded-md border text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                filters.category === 'Todas'
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              Todas
            </button>
            {Object.entries(SurveyCategory)
              .filter(([key]) => key !== 'ALL') // Exclude the 'ALL' category which is only for filtering
              .map(([key, value]) => (
                <button
                  key={value}
                  onClick={() => onFilterChange({ ...filters, category: value })}
                  className={`px-4 py-2 rounded-md border text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                    filters.category === value
                      ? 'bg-primary text-white border-primary shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  {value}
                </button>
              ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Estatus</h3>
          <div className="flex flex-wrap gap-2">
            {/* "Todas" as the first option */}
            <button
              key="todas"
              onClick={() => onFilterChange({ ...filters, status: 'todas' })}
              className={`px-4 py-2 rounded-md border text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                filters.status === 'todas'
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              Todas
            </button>
            {Object.entries(SurveyStatus).map(([key, value]) => {
              if (value !== 'todas') { // Skip the 'todas' option since we added it first
                return (
                  <button
                    key={value}
                    onClick={() => onFilterChange({ ...filters, status: value })}
                    className={`px-4 py-2 rounded-md border text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                      filters.status === value
                        ? 'bg-primary text-white border-primary shadow-md'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    {value === 'activas' ? 'Activas' : 'Inactivas'}
                  </button>
                );
              }
              return null; // Skip the 'todas' option since we already added it at the beginning
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyFilters;