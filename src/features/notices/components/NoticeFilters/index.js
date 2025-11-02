import React from 'react';
import { filterStyles } from './Style';

const NoticeFilters = ({ filters, onFilterChange }) => {
  const handleStatusChange = (e) => {
    onFilterChange({ status: e.target.value });
  };

  return (
    <div className={filterStyles.container}>
      <h3 className={filterStyles.title}>Filtro</h3>
      <div className={filterStyles.filterRow}>
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