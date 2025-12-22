import React, { useState, useEffect } from 'react';

const BannerFilters = ({ filters, onFilterChange }) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Update local state when prop changes
  useEffect(() => {
    setSearchInput(filters.search || '');
  }, [filters.search]);

  // Handle search change with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange({ search: searchInput });
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput, onFilterChange]);

  const handleStatusChange = status => {
    onFilterChange({ status });
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Status filter buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleStatusChange('activas')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filters.status === 'activas'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Activas
          </button>
          <button
            onClick={() => handleStatusChange('inactivas')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filters.status === 'inactivas'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Inactivas
          </button>
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-auto flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar banners..."
              className="w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
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
  );
};

export default BannerFilters;
