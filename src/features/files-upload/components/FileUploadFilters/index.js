import React, { useState, useEffect } from 'react';

const FileUploadFilters = ({ search, onSearchChange }) => {
  const [searchInput, setSearchInput] = useState(search);

  // Update local state when prop changes
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Handle search change with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(searchInput);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput, onSearchChange]);

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Search Input */}
        <div className="w-full sm:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar documentos..."
              className="w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadFilters;