import { useState, useEffect } from 'react';
import { surveyService } from '../services';

export const useSurvey = () => {
  const [allSurveys, setAllSurveys] = useState([]); // Store all surveys
  const [filteredSurveys, setFilteredSurveys] = useState([]); // Store filtered surveys
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ active: 0, inactive: 0 });
  const [filters, setFilters] = useState({
    category: 'Todas',
    status: 'todas'
  });

  // Load all surveys and stats
  const loadAllSurveys = async () => {
    try {
      setLoading(true);
      // Load unfiltered surveys
      const surveysData = await surveyService.getSurveys(); // No filters - get all
      setAllSurveys(surveysData);
      
      const statsData = await surveyService.getSurveyStats();
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to all surveys
  const applyFilters = () => {
    let result = [...allSurveys];
    
    // Apply category filter
    if (filters.category && filters.category !== 'Todas') {
      result = result.filter(survey => survey.category === filters.category);
    }
    
    // Apply status filter
    if (filters.status) {
      if (filters.status === 'activas') {
        result = result.filter(survey => survey.isActive);
      } else if (filters.status === 'inactivas') {
        result = result.filter(survey => !survey.isActive);
      }
      // If status is 'todas', no additional filtering is needed
    }
    
    setFilteredSurveys(result);
  };

  // Load initial data
  useEffect(() => {
    loadAllSurveys();
  }, []);

  // Apply filters whenever filters change or all surveys change
  useEffect(() => {
    applyFilters();
  }, [filters, allSurveys]);

  // Toggle survey status
  const toggleSurveyStatus = async (id) => {
    try {
      const updatedSurvey = await surveyService.toggleSurveyStatus(id);
      if (updatedSurvey) {
        // Update the all surveys list with the new status
        setAllSurveys(prevSurveys =>
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
      // Add the new survey to all surveys
      setAllSurveys(prev => [...prev, newSurvey]);
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
        // Update the all surveys list with the new survey data
        setAllSurveys(prevSurveys =>
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
        // Remove the deleted survey from all surveys
        setAllSurveys(prev => prev.filter(survey => survey.id !== id));
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
    surveys: filteredSurveys, // Return filtered surveys
    loading,
    error,
    stats,
    filters,
    loadSurveys: loadAllSurveys,
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