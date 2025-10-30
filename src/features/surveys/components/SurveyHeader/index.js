import React from 'react';
import { SurveysIcon } from '../../../../shared/components/icons/icons';

const SurveyHeader = ({ activeCount, inactiveCount }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="p-3 bg-primary rounded-lg">
            <SurveysIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Encuestas</h1>
            <p className="text-gray-600">Administración de encuestas</p>
          </div>
        </div>
        
        <div className="flex space-x-6">
          <div className="text-center min-w-[80px]">
            <div className="text-3xl font-bold text-gray-800">{activeCount}</div>
            <div className="text-sm text-gray-600">Activas</div>
          </div>
          <div className="text-center min-w-[80px]">
            <div className="text-3xl font-bold text-gray-800">{inactiveCount}</div>
            <div className="text-sm text-gray-600">Inactivas</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyHeader;