import { useState, useEffect } from 'react';
import { surveyService } from '../services';
import { useContext } from 'react';
import { AppContext } from '../../../shared/context/AppContext';

export const useSurvey = () => {
  const { addLog, addToast } = useContext(AppContext);
  const [allSurveys, setAllSurveys] = useState([]); // Store all surveys
  const [filteredSurveys, setFilteredSurveys] = useState([]); // Store filtered surveys
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ active: 0, inactive: 0 });
  const [filters, setFilters] = useState({
    category: 'Todas',
    status: 'activas',
    search: ''
  });

  const [surveyCategoryOptions, setSurveyCategoryOptions] = useState([]);
  const [surveyPriorityOptions, setSurveyPriorityOptions] = useState([]);

  const [loadingSurveyCategory, setLoadingSurveyCategory] = useState(false);
  const [loadingSurveyPriority, setLoadingSurveyPriority] = useState(false);

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
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(survey => 
        survey.title.toLowerCase().includes(searchTerm) || 
        survey.description.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredSurveys(result);
  };

  // Load initial data
  useEffect(() => {
    const loadSurveyCategoryOptions = async () => {
      try {
        setLoadingSurveyCategory(true);
        const options = await surveyService.getSurveyCategoryOptions();
        setSurveyCategoryOptions(options);
      } catch (error) {
        console.error('Error loading survey category options:', error);
        addLog('Error al cargar las opciones de categoría de encuestas');
        addToast('Error al cargar las opciones de categoría de encuestas', 'error');
      } finally {
        setLoadingSurveyCategory(false);
      }
    };
    const loadSurveyPriorityOptions = async () => {
      try {
        setLoadingSurveyPriority(true);
        const options = await surveyService.getSurveyPriorityOptions();
        setSurveyPriorityOptions(options);
      } catch (error) {
        console.error('Error loading survey priority options:', error);
        addLog('Error al cargar las opciones de prioridad de encuestas');
        addToast('Error al cargar las opciones de prioridad de encuestas', 'error');
      } finally {
        setLoadingSurveyPriority(false);
      }
    };
    loadSurveyCategoryOptions();
    loadSurveyPriorityOptions();
    loadAllSurveys();
  }, [addLog, addToast]);

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

 const buildSurveyData = (formData) => {
    return {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      estimatedTime: formData.estimatedTime,
      //imageUrl: formData.imageUrl,
      isActive: true,
      questions: formData.questions.map((q, qIndex) => ({
        surveyId: 0,
        question: q.question,
        type: q.type,
        required: q.required,
        order: qIndex,
        options: (q.type === "SELECT" || q.type === "CHECKBOX" || q.type === "BOOLEAN" || q.type === "YES_NO")
          ? q.options.map((opt, optIndex) => ({
              surveyQuestionId: 0,
              option: opt,
              value: opt.toLowerCase().replace(/\s/g, ''),
              order: optIndex
            }))
          : []
      }))
      /*questions: [
        {
          //surveyId: 0,
          question: formData.question,
          type: formData.type,
          required: formData.required,
          //order: formData.order,
          options: [
            {
              //surveyQuestionId: 0,
              option: formData.option,
              //value: formData.value,
              //order: formData.order
            },
            {
              //surveyQuestionId: 0,
              option: formData.option,
              //value: formData.value,
              //order: formData.order
            }
          ]
        }
      ]*/
    };
  };

  // Create new survey
  const createSurvey = async (surveyData) => {
    const surveyDataF = buildSurveyData(surveyData);
    try {
      setLoading(true);
      const newSurvey = await surveyService.createSurvey(surveyDataF);
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
      status: 'todas',
      search: ''
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
    deleteSurvey,
    surveyCategoryOptions,
    surveyPriorityOptions,
    loadingSurveyCategory,
    loadingSurveyPriority,
    addLog,
    addToast
  };
};