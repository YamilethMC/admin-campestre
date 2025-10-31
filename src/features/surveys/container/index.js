import React, { useState } from 'react';
import SurveyHeader from '../components/SurveyHeader';
import SurveyFilters from '../components/SurveyFilters';
import SurveyList from '../components/SurveyList';
import SurveyForm from '../components/SurveyForm';
import SurveyResponses from '../components/SurveyResponses';
import { useSurvey } from '../hooks/useSurvey';

const SurveysContainer = () => {
  const [view, setView] = useState('list'); // 'list', 'form', or 'responses'
  const [currentSurvey, setCurrentSurvey] = useState(null);
  const [responses, setResponses] = useState(null);
  
  const {
    surveys,
    loading,
    error,
    stats,
    filters,
    loadSurveys,
    toggleSurveyStatus,
    createSurvey,
    updateSurvey,
    getSurveyResponses,
    getSurveyById,
    updateFilters,
    deleteSurvey
  } = useSurvey();

  // Handle adding a new survey
  const handleAddSurvey = () => {
    setCurrentSurvey(null);
    setView('form');
  };

  // Handle editing a survey
  const handleEditSurvey = async (survey) => {
    try {
      // Get the full survey data including questions
      const fullSurvey = await getSurveyById(survey.id);
      setCurrentSurvey(fullSurvey);
      setView('form');
    } catch (err) {
      console.error('Error fetching survey:', err);
    }
  };

  // Handle viewing responses
  const handleViewResponses = async (survey) => {
    try {
      const surveyResponses = await getSurveyResponses(survey.id);
      setCurrentSurvey(survey);
      setResponses(surveyResponses);
      setView('responses');
    } catch (err) {
      console.error('Error fetching responses:', err);
    }
  };

  // Handle saving a survey (create or update)
  const handleSaveSurvey = async (surveyData) => {
    try {
      if (currentSurvey) {
        // Update existing survey
        await updateSurvey(currentSurvey.id, surveyData);
      } else {
        // Create new survey
        await createSurvey(surveyData);
      }
      setView('list');
    } catch (err) {
      console.error('Error saving survey:', err);
    }
  };

  // Handle canceling form
  const handleCancelForm = () => {
    setView('list');
    setCurrentSurvey(null);
  };

  // Handle going back from responses view
  const handleBackFromResponses = () => {
    setView('list');
    setCurrentSurvey(null);
    setResponses(null);
  };

  // Handle deleting a survey
  const handleDeleteSurvey = async (id) => {
    try {
      await deleteSurvey(id);
    } catch (err) {
      console.error('Error deleting survey:', err);
    }
  };

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  // Render the current view
  if (view === 'form') {
    return (
      <SurveyForm
        survey={currentSurvey}
        onSave={handleSaveSurvey}
        onCancel={handleCancelForm}
      />
    );
  }

  if (view === 'responses') {
    return (
      <SurveyResponses
        survey={currentSurvey}
        responses={responses}
        onBack={handleBackFromResponses}
      />
    );
  }

  // Default list view - show content even if loading
  return (
    <div>
      <SurveyHeader 
        activeCount={stats.active} 
        inactiveCount={stats.inactive} 
      />
      
      <SurveyFilters 
        filters={filters}
        onFilterChange={updateFilters}
      />
      
      <SurveyList
        surveys={surveys}
        filters={filters}
        loading={loading} // Pass loading state to the list component so it can handle it internally if needed
        onEdit={handleEditSurvey}
        onViewResponses={handleViewResponses}
        onToggleStatus={toggleSurveyStatus}
        onDelete={handleDeleteSurvey}
        onAddSurvey={handleAddSurvey}
      />
    </div>
  );
};

export default SurveysContainer;