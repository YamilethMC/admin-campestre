import React from 'react';

const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        <div className="text-sm text-gray-600">Total</div>
      </div>
      <div className="bg-yellow-50 rounded-lg p-4">
        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
        <div className="text-sm text-gray-600">Pendientes</div>
      </div>
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="text-2xl font-bold text-blue-600">{stats.inReview}</div>
        <div className="text-sm text-gray-600">En revisión</div>
      </div>
      <div className="bg-green-50 rounded-lg p-4">
        <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
        <div className="text-sm text-gray-600">Aprobadas</div>
      </div>
      <div className="bg-red-50 rounded-lg p-4">
        <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
        <div className="text-sm text-gray-600">Rechazadas</div>
      </div>
    </div>
  );
};

export default StatsCards;
