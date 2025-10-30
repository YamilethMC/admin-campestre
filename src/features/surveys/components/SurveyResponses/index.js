import React from 'react';
import './SurveyResponses.css';

const SurveyResponses = ({ survey, responses, onBack }) => {
  // Calculate statistics for each question
  const calculateQuestionStats = (questionResponses, totalParticipants, questionType, isRequired) => {
    if (!questionResponses || questionResponses.length === 0) return null;
    
    // Determine the actual count to display
    const displayCount = isRequired ? totalParticipants : questionResponses.length;
    
    // If it's a rating question, calculate average and distribution
    if (questionType === 'rating' || (questionResponses.length > 0 && !isNaN(parseFloat(questionResponses[0].value)))) {
      const numericValues = questionResponses.map(r => parseFloat(r.value)).filter(v => !isNaN(v));
      const average = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
      
      // Calculate distribution (how many responses for each rating)
      const distribution = {};
      for (let i = 1; i <= 10; i++) {
        distribution[i] = 0;
      }
      numericValues.forEach(value => {
        const roundedValue = Math.round(value);
        if (distribution.hasOwnProperty(roundedValue)) {
          distribution[roundedValue]++;
        }
      });
      
      return {
        average: average.toFixed(1),
        count: questionResponses.length,
        displayCount: displayCount,
        distribution
      };
    }
    
    // For text questions, collect all responses
    if (questionType === 'text') {
      return {
        count: questionResponses.length,
        displayCount: displayCount,
        responses: questionResponses.map(r => r.value)
      };
    }
    
    // For multiple choice, count options
    const optionCounts = {};
    questionResponses.forEach(response => {
      if (optionCounts[response.value]) {
        optionCounts[response.value]++;
      } else {
        optionCounts[response.value] = 1;
      }
    });
    
    // Calculate percentage based on either total participants (if required) or actual responses
    const baseCount = isRequired ? totalParticipants : questionResponses.length;
    const calculatedPercentage = (count) => {
      if (baseCount === 0) return 0;
      return Math.round((count / baseCount) * 100);
    };
    
    return {
      optionCounts,
      count: questionResponses.length,
      displayCount: displayCount,
      percentages: Object.keys(optionCounts).reduce((acc, option) => {
        acc[option] = calculatedPercentage(optionCounts[option]);
        return acc;
      }, {})
    };
  };

  // Function to trigger the browser's print dialog
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto print-container" style={{ display: 'block' }}>
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 p-2 rounded-md hover:bg-gray-100 transition-colors no-print"
          aria-label="Regresar"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Respuestas de Encuesta</h2>
      </div>

      {/* Survey Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-800 mb-2">{survey.title}</h1>
            <p className="text-gray-600 mb-4">{survey.description}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{survey.estimatedTime}</span>
              </div>
              
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{survey.participantCount} personas</span>
              </div>
              
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{survey.questionCount} preguntas</span>
              </div>
              
              <div>
                <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
                  survey.isActive 
                    ? 'bg-green-100 text-green-800 border-green-200' 
                    : 'bg-gray-100 text-gray-800 border-gray-200'
                }`}>
                  {survey.isActive ? 'Activa' : 'Inactiva'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="ml-6">
            <button 
              onClick={handlePrint}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Imprimir
            </button>
          </div>
        </div>
      </div>

      {/* Responses */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-800">Respuestas a las preguntas</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {responses && responses.length > 0 ? (
            responses.map((questionResponse, index) => {
              const stats = calculateQuestionStats(
                questionResponse.responses, 
                survey.participantCount, 
                questionResponse.type, 
                questionResponse.required
              );
              
              return (
                <div key={questionResponse.questionId} className="p-6">
                  <div className="mb-4">
                    <h4 className="text-md font-medium text-gray-800 mb-2">
                      {index + 1}. {questionResponse.question}
                      {questionResponse.required && (
                        <span className="ml-2 text-xs text-red-600">(obligatoria)</span>
                      )}
                    </h4>
                    
                    {/* Statistics */}
                    {stats && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-md">
                        <div className="text-sm text-gray-600 mb-2">
                          {stats.average ? (
                            <div>
                              Total: {stats.displayCount} respuestas | Promedio: {stats.average}/10
                              {questionResponse.required && stats.count !== stats.displayCount && (
                                <span className="block text-xs text-gray-500">
                                  (de {survey.participantCount} participantes)
                                </span>
                              )}
                            </div>
                          ) : stats.responses ? ( // Text response type
                            <div>Total: {stats.displayCount} respuestas</div>
                          ) : stats.optionCounts ? ( // Multiple choice type
                            <div>Total: {stats.displayCount} respuestas</div>
                          ) : (
                            <div>Total: {stats.displayCount} respuestas</div>
                          )}
                        </div>
                        
                        {/* Distribution for rating questions */}
                        {stats.distribution && (
                          <div className="mb-3">
                            <div className="text-xs text-gray-600 mb-1">Distribución de calificaciones:</div>
                            <div className="space-y-1">
                              {Object.entries(stats.distribution)
                                .filter(([rating, count]) => count > 0)
                                .sort(([a], [b]) => b - a) // Sort in descending order (10 to 1)
                                .map(([rating, count]) => (
                                  <div key={rating} className="flex items-center">
                                    <div className="w-8 text-sm font-medium">{rating}</div>
                                    <div className="flex-1 ml-2">
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                          className="bg-primary h-2 rounded-full" 
                                          style={{ width: `${(count / stats.displayCount) * 100}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                    <div className="w-12 text-right text-sm">{count}</div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Text responses (open questions) */}
                        {stats.responses && (
                          <div className="space-y-2">
                            <div className="text-xs text-gray-600">Respuestas:</div>
                            {stats.responses.length > 0 ? (
                              stats.responses.map((response, idx) => (
                                <div key={idx} className="p-2 bg-white rounded border border-gray-200 text-sm">
                                  "{response}"
                                </div>
                              ))
                            ) : (
                              <div className="p-2 bg-white rounded border border-gray-200 text-sm italic text-gray-500">
                                Por este ejercicio, por favor
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Options for multiple choice questions */}
                        {stats.optionCounts && (
                          <div className="space-y-2">
                            <div className="text-xs text-gray-600">Opciones:</div>
                            {Object.entries(stats.optionCounts).map(([option, count]) => (
                              <div key={option} className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">{option}</span>
                                  <div className="flex items-center">
                                    <span className="text-sm font-medium mr-2">{count} respuestas</span>
                                    {stats.percentages && (
                                      <span className="text-xs text-gray-600">({stats.percentages[option]}%)</span>
                                    )}
                                  </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-primary h-2 rounded-full" 
                                    style={{ width: `${stats.percentages ? stats.percentages[option] : 0}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-500">
              Aún no hay respuestas para esta encuesta
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyResponses;