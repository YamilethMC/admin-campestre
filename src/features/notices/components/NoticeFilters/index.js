import React from 'react';
import { filterStyles } from './Style';
import { NoticeCategory, NoticeStatus } from '../../interfaces';

const NoticeFilters = ({ filters, onFilterChange }) => {
  const handleCategoryChange = (e) => {
    onFilterChange({ category: e.target.value });
  };

  const handleStatusChange = (e) => {
    onFilterChange({ status: e.target.value });
  };

  return (
    <div className={filterStyles.container}>
      <h3 className={filterStyles.title}>Filtros</h3>
      <div className={filterStyles.filterRow}>
        <div className={filterStyles.filterGroup}>
          <label className={filterStyles.label}>Categoría</label>
          <select
            value={filters.category}
            onChange={handleCategoryChange}
            className={filterStyles.select}
          >
            {Object.entries(NoticeCategory)
              .filter(([key]) => key !== 'ALL') // Exclude the 'ALL' category which is only for filtering
              .map(([key, value]) => (
                <option key={key} value={value}>{value}</option>
              ))}
          </select>
        </div>
        <div className={filterStyles.filterGroup}>
          <label className={filterStyles.label}>Estado</label>
          <select
            value={filters.status}
            onChange={handleStatusChange}
            className={filterStyles.select}
          >
            <option value="todas">Todas</option>
            <option value="activas">Activas</option>
            <option value="inactivas">Inactivas</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default NoticeFilters;