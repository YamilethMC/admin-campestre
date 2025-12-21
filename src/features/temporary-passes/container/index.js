import React from 'react';
import TemporaryPassesList from '../components/TemporaryPassesList';

const TemporaryPassesContainer = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pases temporales</h1>
        <p className="mt-2 text-gray-600">
          Gestiona las solicitudes de pases temporales pendientes de aprobación
        </p>
      </div>
      <TemporaryPassesList />
    </div>
  );
};

export default TemporaryPassesContainer;
