import React, { useState } from 'react';
import { EventTypesOptions } from '../../interfaces';

const EventFilters = ({ filters, onFilterChange, onDateChange }) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [typeFilter, setTypeFilter] = useState(filters.type || 'TODAS');
  const [dateInput, setDateInput] = useState(filters.date || new Date().toISOString().slice(0, 7));

  // Handle search with debounce - using useRef to maintain reference
  const timeoutRef = React.useRef(null);

  React.useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      onFilterChange({ search: searchInput });
    }, 500);

    // Cleanup function to clear timeout when component unmounts or dependencies change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchInput, onFilterChange]);

  // Handle date change
  React.useEffect(() => {
    onDateChange(dateInput);
  }, [dateInput, onDateChange]);

  // Handle type change
  React.useEffect(() => {
    onFilterChange({ type: typeFilter });
  }, [typeFilter, onFilterChange]);

  // Handle month/year navigation
  const navigateMonth = direction => {
    const [year, month] = dateInput.split('-').map(Number);
    let newDate = new Date(year, month - 1 + direction, 1);
    const newYear = newDate.getFullYear();
    const newMonth = String(newDate.getMonth() + 1).padStart(2, '0');
    setDateInput(`${newYear}-${newMonth}`);
  };

  // Format date for display (e.g., "Noviembre 2025")
  const formatDateDisplay = dateStr => {
    const [year, month] = dateStr.split('-');
    const date = new Date(year, month - 1, 1);
    return date.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Type Filter - First (2/6 of the screen) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Evento</label>
          <div className="flex flex-wrap gap-2">
            {EventTypesOptions.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTypeFilter(option.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  typeFilter === option.value
                    ? 'bg-primary text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date Filter - Second (2/6 of the screen) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <button
              onClick={() => navigateMonth(-1)}
              className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <input
              type="month"
              value={dateInput}
              onChange={e => setDateInput(e.target.value)}
              className="flex-1 px-2 py-1.5 border-0 focus:outline-none focus:ring-0 text-center text-sm"
            />
            <button
              onClick={() => navigateMonth(1)}
              className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          {/*<div className="text-center text-xs text-gray-600 mt-1">
            {formatDateDisplay(dateInput)}
          </div>*/}
        </div>

        {/* Search Filter - Last (2/6 of the screen) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
          <div className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full pl-7 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventFilters;
