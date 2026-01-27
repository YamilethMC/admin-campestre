import React from 'react';
import TemporaryPassesList from '../components/TemporaryPassesList';

const TemporaryPassesContainer = () => {
  return (
    <div>
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Pases Temporales</h1>
            <p className="text-gray-600">Gestión de pases temporales</p>
          </div>
        </div>
      </div>
      <TemporaryPassesList />
    </div>
  );
};

export default TemporaryPassesContainer;
