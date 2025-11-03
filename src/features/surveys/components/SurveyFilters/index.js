import React from 'react';
import { SurveyCategory, SurveyStatus } from '../../interfaces';
import { filterStyles } from './Style';

const SurveyFilters = ({ filters, onFilterChange }) => {
  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  return (
    <div className={filterStyles.container}>
      <div className={filterStyles.filterRow}>
        {/* Category Filter */}
        <div className={filterStyles.filterGroup}>
          <h3 className={filterStyles.label}>Categoría</h3>
          <div className="flex flex-wrap gap-2">
            {/* "Todas" as the first option */}
            <button
              key="Todas"
              onClick={() => onFilterChange({ ...filters, category: 'Todas' })}
              className={`${filterStyles.filterButton} ${
                filters.category === 'Todas'
                  ? filterStyles.activeFilterButton
                  : filterStyles.inactiveFilterButton
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
                  className={`${filterStyles.filterButton} ${
                    filters.category === value
                      ? filterStyles.activeFilterButton
                      : filterStyles.inactiveFilterButton
                  }`}
                >
                  {value}
                </button>
              ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className={filterStyles.filterGroup}>
          <h3 className={filterStyles.label}>Estatus</h3>
          <div className="flex flex-wrap gap-2">
            {/* "Todas" as the first option */}
            <button
              key="todas"
              onClick={() => onFilterChange({ ...filters, status: 'todas' })}
              className={`${filterStyles.filterButton} ${
                filters.status === 'todas'
                  ? filterStyles.activeFilterButton
                  : filterStyles.inactiveFilterButton
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
                    className={`${filterStyles.filterButton} ${
                      filters.status === value
                        ? filterStyles.activeFilterButton
                        : filterStyles.inactiveFilterButton
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
      
      {/* Search Filter - Separate section */}
      <div className={filterStyles.searchContainer}>
        <h3 className={filterStyles.label}>Buscar</h3>
        <input
          type="text"
          placeholder="Buscar encuestas por título o descripción..."
          value={filters.search || ''}
          onChange={handleSearchChange}
          className={filterStyles.searchInput}
        />
      </div>
    </div>
  );
};

export default SurveyFilters;