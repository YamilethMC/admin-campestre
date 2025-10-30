import { useState, useEffect } from 'react';
import { surveyService } from '../services';

export const useSurvey = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ active: 0, inactive: 0 });
  const [filters, setFilters] = useState({
    category: 'Todas',
    status: 'todas'
  });

  // Load surveys and stats
  const loadSurveys = async () => {
    try {
      setLoading(true);
      const surveysData = await surveyService.getSurveys(filters);
      setSurveys(surveysData);
      
      const statsData = await surveyService.getSurveyStats();
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    loadSurveys();
  }, [filters.category, filters.status]);

  // Toggle survey status
  const toggleSurveyStatus = async (id) => {
    try {
      const updatedSurvey = await surveyService.toggleSurveyStatus(id);
      if (updatedSurvey) {
        setSurveys(prevSurveys =>
          prevSurveys.map(survey =>
            survey.id === id ? updatedSurvey : survey
          )
        );
        
        // Update stats
        const updatedStats = await surveyService.getSurveyStats();
        setStats(updatedStats);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Create new survey
  const createSurvey = async (surveyData) => {
    try {
      setLoading(true);
      const newSurvey = await surveyService.createSurvey(surveyData);
      loadSurveys(); // Reload all surveys to include the new one
      return newSurvey;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update existing survey
  const updateSurvey = async (id, surveyData) => {
    try {
      setLoading(true);
      const updatedSurvey = await surveyService.updateSurvey(id, surveyData);
      if (updatedSurvey) {
        setSurveys(prevSurveys =>
          prevSurveys.map(survey =>
            survey.id === id ? updatedSurvey : survey
          )
        );
        
        // Update stats
        const updatedStats = await surveyService.getSurveyStats();
        setStats(updatedStats);
      }
      return updatedSurvey;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get responses for a survey
  const getSurveyResponses = async (surveyId) => {
    try {
      setLoading(true);
      const responses = await surveyService.getSurveyResponses(surveyId);
      return responses;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get a single survey by ID
  const getSurveyById = async (id) => {
    try {
      setLoading(true);
      const survey = await surveyService.getSurveyById(id);
      return survey;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  // Delete a survey
  const deleteSurvey = async (id) => {
    try {
      const success = await surveyService.deleteSurvey(id);
      if (success) {
        // Reload surveys to reflect the deletion
        loadSurveys();
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Reset filters to default
  const resetFilters = () => {
    setFilters({
      category: 'Todas',
      status: 'todas'
    });
  };

  return {
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
    resetFilters,
    deleteSurvey
  };
};