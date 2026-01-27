import React from 'react';

const CatalogStats = ({ catalog }) => {
  const catalogArray = Array.isArray(catalog) ? catalog : [];
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-2xl font-bold text-gray-900">{catalogArray.length}</div>
        <div className="text-sm text-gray-600">Total documentos</div>
      </div>
      <div className="bg-green-50 rounded-lg p-4">
        <div className="text-2xl font-bold text-green-600">
          {catalogArray.filter(doc => doc.active).length}
        </div>
        <div className="text-sm text-gray-600">Activos</div>
      </div>
      <div className="bg-red-50 rounded-lg p-4">
        <div className="text-2xl font-bold text-red-600">
          {catalogArray.filter(doc => doc.required).length}
        </div>
        <div className="text-sm text-gray-600">Requeridos</div>
      </div>
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="text-2xl font-bold text-blue-600">
          {catalogArray.filter(doc => !doc.active).length}
        </div>
        <div className="text-sm text-gray-600">Inactivos</div>
      </div>
    </div>
  );
};

export default CatalogStats;
