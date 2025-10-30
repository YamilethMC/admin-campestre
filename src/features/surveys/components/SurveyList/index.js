import React from 'react';
import SurveyCard from '../SurveyCard';

const SurveyList = ({ surveys, filters, onEdit, onViewResponses, onToggleStatus, onDelete, onAddSurvey }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Lista de Encuestas</h2>
        <button
          onClick={onAddSurvey}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Agregar Encuesta
        </button>
      </div>
      
      {surveys.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No hay encuestas</h3>
          <p className="text-gray-500">No hay encuestas disponibles con los filtros aplicados</p>
        </div>
      ) : (
        surveys.map(survey => (
          <SurveyCard
            key={survey.id}
            survey={survey}
            onEdit={onEdit}
            onViewResponses={onViewResponses}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};

export default SurveyList;