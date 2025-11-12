import { useState, useEffect } from 'react';
import { surveyService } from '../services';
import { useContext } from 'react';
import { AppContext } from '../../../shared/context/AppContext';

export const useSurvey = () => {
  const { addLog, addToast } = useContext(AppContext);
  const [surveys, setSurveys] = useState([]);
  const [meta, setMeta] = useState(null);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [status, setStatus] = useState('true'); // 👈 Estado para status ('true' for active, 'false' for inactive)
  const [category, setCategory] = useState('TODAS'); // 👈 Estado para categoría
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const [surveyCategoryOptions, setSurveyCategoryOptions] = useState([]);
  const [surveyPriorityOptions, setSurveyPriorityOptions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingSurveyCategory, setLoadingSurveyCategory] = useState(false);
  const [loadingSurveyPriority, setLoadingSurveyPriority] = useState(false);
  const [error, setError] = useState(null);

  const loadSurveys = async ({page = 1, limit = 10, status: statusParam = status, category: categoryParam = category, search: searchParam = search } = {})=> {
    try {
      setLoading(true);
      const data = await surveyService.fetchSurveys({ page, limit, status: statusParam, category: categoryParam, search: searchParam });
      setSurveys(data.surveys);
      setMeta(data.meta);
      setActiveCount(data.activeCount);
      setInactiveCount(data.inactiveCount);
    } catch (err) {
      setError(err.message);
      console.error("Error loading surveys:", err);
    } finally {
      setLoading(false);
    }
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
    loadSurveys({page, status, category, search});
  }, [addLog, addToast, status, page, category, search]);

  // Toggle survey status
  const toggleSurveyStatus = async (id) => {
    try {
      const updatedSurvey = await surveyService.toggleSurveyStatus(id);
      // Refresh the list to reflect the status change
      loadSurveys();
    } catch (err) {
      setError(err.message);
    }
  };

    const buildUpdateSurveyData = (formData) => {
    console.log('formData update: ', formData)
  return {
    title: formData.title,
    description: formData.description,
    active: formData.active,
    priority: formData.priority,
    category: formData.category,
    timeStimed: formData.estimatedTime,
    questions: formData.questions.map((q, qIndex) => {
    // Se construye la pregunta base
    const question = {
      question: q.question,
      type: q.type,
      required: q.required,
      order: qIndex,
    };

    // Solo se agrega id si es > 0
    if (q.id && q.id > 0) {
      question.id = q.id;
    }

    // Verifica si el tipo de pregunta requiere opciones
    if (["SELECT", "CHECKBOX", "BOOLEAN", "YES_NO"].includes(q.type)) {
      question.options = q.options.map((opt, optIndex) => {
        console.log('opt: ', opt.id)
        // Si opt es string, lo convertimos a objeto
        const optionText = typeof opt === "string" ? opt : opt.option;

        const option = {
          option: optionText,
          value: optionText.toLowerCase().replace(/\s/g, ""),
          order: optIndex,
        };

        // Solo se agrega id si es > 0
        if (opt.id && opt.id > 0) {
          option.id = opt.id;
        }

        return option;
      });
    } else {
      question.options = [];
    }

    return question;
  }),
};
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
      // Refresh the list to show the new survey
      loadSurveys();
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
    console.log('surveyData LLEGUEEEEE: ')
    const surveyDataF = buildUpdateSurveyData(surveyData);
    console.log('surveyDataF: ', surveyDataF)
    try {
      setLoading(true);
      const updatedSurvey = await surveyService.updateSurvey(id, surveyDataF);
      console.log('updatedSurvey: ', updatedSurvey)
      if (updatedSurvey) {
        // Refresh the list to reflect the update
        loadSurveys();
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
      console.log('survey: ', survey)
      return survey;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a survey
  const deleteSurvey = async (id) => {
    try {
      const success = await surveyService.deleteSurvey(id);
      if (success) {
        // If the current page has only one survey and there are other pages, go to previous page
        if (surveys.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          // Refresh the list to reflect the deletion
          loadSurveys();
        }
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    surveys,
    meta,
    activeCount,
    inactiveCount,
    status,
    setStatus,
    category,
    setCategory,
    page,
    setPage,
    loadSurveys,
    search,
    setSearch,
    loading,
    error,
    toggleSurveyStatus,
    createSurvey,
    updateSurvey,
    getSurveyResponses,
    getSurveyById,
    deleteSurvey,
    surveyCategoryOptions,
    surveyPriorityOptions,
    loadingSurveyCategory,
    loadingSurveyPriority,
    addLog,
    addToast
  };
};