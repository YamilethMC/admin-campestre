import React from 'react';
import { SurveyCategory, SurveyStatus } from '../../interfaces';
import { filterStyles } from './Style';

const SurveyFilters = ({ filters, onFilterChange }) => {
  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value });
  };

  const handleStatusChange = (status) => {
    let statusValue = '';
    if (status === 'activas') {
      statusValue = 'true';
    } else if (status === 'inactivas') {
      statusValue = 'false';
    } else {
      statusValue = 'true'; // Default to active
    }
    onFilterChange({ status: statusValue });
  };

  const handleCategoryChange = (category) => {
    onFilterChange({ category });
  };

  // Function to map status values for UI display
  const getStatusDisplayValue = (status) => {
    if (status === 'true') return 'activas';
    if (status === 'false') return 'inactivas';
    return 'activas'; // default to activas for any other value
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
              onClick={() => handleCategoryChange('TODAS')}
              className={`${filterStyles.filterButton} ${
                filters.category === 'TODAS' || filters.category === 'Todas'
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
                  key={key} // Use the key (English value) as the identifier
                  onClick={() => handleCategoryChange(key)} // Send the English value to the API
                  className={`${filterStyles.filterButton} ${
                    filters.category === key // Compare with the English value
                      ? filterStyles.activeFilterButton
                      : filterStyles.inactiveFilterButton
                  }`}
                >
                  {value} {/* Display the Spanish value */}
                </button>
              ))}
          </div>
        </div>

        {/* Status Filter - without "Todas" option */}
        <div className={filterStyles.filterGroup}>
          <h3 className={filterStyles.label}>Estatus</h3>
          <div className="flex flex-wrap gap-2">
            <button
              key="activas"
              onClick={() => handleStatusChange('activas')}
              className={`${filterStyles.filterButton} ${
                getStatusDisplayValue(filters.status) === 'activas'
                  ? filterStyles.activeFilterButton
                  : filterStyles.inactiveFilterButton
              }`}
            >
              Activas
            </button>
            <button
              key="inactivas"
              onClick={() => handleStatusChange('inactivas')}
              className={`${filterStyles.filterButton} ${
                getStatusDisplayValue(filters.status) === 'inactivas'
                  ? filterStyles.activeFilterButton
                  : filterStyles.inactiveFilterButton
              }`}
            >
              Inactivas
            </button>
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