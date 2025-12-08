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
      const result = await surveyService.fetchSurveys({ page, limit, status: statusParam, category: categoryParam, search: searchParam });

      if (result.success) {
        setSurveys(result.data.surveys);
        setMeta(result.data.meta);
        setActiveCount(result.data.activeCount);
        setInactiveCount(result.data.inactiveCount);
      } else {
        addLog('Error al cargar las encuestas');
        addToast(result.error || 'Error desconocido', 'error');
        return;
      }
    } catch (err) {
      addLog('Error desconocido al cargar las encuestas');
      addToast(err.message || 'Error desconocido', 'error');
      return;
    } finally {
      setLoading(false);
    }
  };

  // Set up auto-refresh every 30 minutes (1800000 ms)
  useEffect(() => {
    const autoRefreshInterval = setInterval(() => {
      loadSurveys({page, status, category, search});
    }, 1800000); // 30 minutes = 1800000 ms

    // Load initial data
    const loadSurveyCategoryOptions = async () => {
      try {
        setLoadingSurveyCategory(true);
        const options = await surveyService.getSurveyCategoryOptions();
        setSurveyCategoryOptions(options);
      } catch (error) {
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
        addLog('Error al cargar las opciones de prioridad de encuestas');
        addToast('Error al cargar las opciones de prioridad de encuestas', 'error');
      } finally {
        setLoadingSurveyPriority(false);
      }
    };
    loadSurveyCategoryOptions();
    loadSurveyPriorityOptions();
    loadSurveys({page, status, category, search});

    // Cleanup interval on unmount
    return () => {
      clearInterval(autoRefreshInterval);
    };
  }, [addLog, addToast, status, page, category, search]);

  // Toggle survey status
  const toggleSurveyStatus = async (id) => {
    try {
      const result = await surveyService.toggleSurveyStatus(id);

      if (result.success) {
        loadSurveys();
      } else {
        addToast(result.error || 'Error desconocido', 'error');
        return;
      }
    } catch (err) {
      addToast(err.message || 'Error desconocido', 'error');
      return;
    }
  };

  const buildUpdateSurveyData = (formData) => {
    return {
      title: formData.title,
      description: formData.description,
      active: formData.active,
      priority: formData.priority,
      category: formData.category,
      timeStimed: formData.estimatedTime,
      showResponseCount: formData.showResponseCount, // Include showResponseCount in update
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
      showResponseCount: formData.showResponseCount,
      isActive: true,
      questions: formData.questions.map((q, qIndex) => ({
        surveyId: 0,
        question: q.question,
        type: q.type,
        required: q.required,
        order: qIndex,
        options: (q.type === "SELECT" || q.type === "BOOLEAN")
          ? q.options.map((opt, optIndex) => ({
              surveyQuestionId: 0,
              option: opt.option,
              value: opt.option,
              order: opt.id
            }))
          : []
      }))
    };
  };

  // Create new survey
  const createSurvey = async (surveyData) => {
    try {
      setLoading(true);

      // Convert image to base64 if it exists
      const formData = new FormData();

      // Add all survey fields except imageFile
      const surveyFields = {
        title: surveyData.title,
        description: surveyData.description,
        category: surveyData.category,
        priority: surveyData.priority,
        estimatedTime: surveyData.estimatedTime,
        isActive: true,
        showResponseCount: surveyData.showResponseCount,
        questions: surveyData.questions.map((q, qIndex) => ({
          surveyId: 0,
          question: q.question,
          type: q.type,
          required: q.required,
          order: qIndex,
          options: (q.type === "SELECT" || q.type === "BOOLEAN")
            ? q.options.map((opt, optIndex) => ({
                surveyQuestionId: 0,
                option: opt.option,
                value: opt.option,
                order: opt.id
              }))
            : []
        }))
      };

      // Add survey fields as JSON string to formData
      formData.append('surveyData', JSON.stringify(surveyFields));

      // Add image if it exists
      if (surveyData.imageFile) {
        // Convert image to base64 string
        const base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result.split(',')[1]; // Remove data:image/jpeg;base64, prefix
            resolve(result);
          };
          reader.onerror = () => {
            reject(new Error('Error al leer la imagen'));
          };
          reader.readAsDataURL(surveyData.imageFile);
        });

        formData.append('image', base64Image);
      }

      const result = await surveyService.createSurvey(formData);

      if (result.success) {
        loadSurveys();
        return result.data;
      } else {
        addToast(result.error || 'Error desconocido', 'error');
        return null;
      }
    } catch (err) {
      addToast(err.message || 'Error desconocido', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update existing survey
  const updateSurvey = async (id, surveyData) => {
    try {
      setLoading(true);

      // Check if image has changed
      if (surveyData.imageFile) {
        // Image has changed, send as FormData
        const formData = new FormData();

        // Build update survey data excluding imageFile
        const surveyFields = {
          title: surveyData.title,
          description: surveyData.description,
          active: surveyData.active,
          priority: surveyData.priority,
          category: surveyData.category,
          timeStimed: surveyData.estimatedTime,
          showResponseCount: surveyData.showResponseCount,
          questions: surveyData.questions.map((q, qIndex) => {
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

        // Add survey fields as JSON string to formData
        formData.append('surveyData', JSON.stringify(surveyFields));

        // Add image if it exists
        if (surveyData.imageFile) {
          // Convert image to base64 string
          const base64Image = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const result = reader.result.split(',')[1]; // Remove data:image/jpeg;base64, prefix
              resolve(result);
            };
            reader.onerror = () => {
              reject(new Error('Error al leer la imagen'));
            };
            reader.readAsDataURL(surveyData.imageFile);
          });

          formData.append('image', base64Image);
        }

        const result = await surveyService.updateSurvey(id, formData);

        if (result.success) {
          loadSurveys();
          return result.data;
        } else {
          addToast(result.error || 'Error desconocido', 'error');
          return null;
        }
      } else {
        // No image change, use regular update
        const surveyDataF = buildUpdateSurveyData(surveyData);
        const result = await surveyService.updateSurvey(id, surveyDataF);

        if (result.success) {
          loadSurveys();
          return result.data;
        } else {
          addToast(result.error || 'Error desconocido', 'error');
          return null;
        }
      }
    } catch (err) {
      addToast(err.message || 'Error desconocido', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get responses for a survey
  const getSurveyResponses = async (surveyId) => {
    try {
      setLoading(true);
      const result = await surveyService.getSurveyResponses(surveyId);

      if (result.success) {
        return result.data;
      } else {
        addToast(result.error || 'Error desconocido', 'error');
        return null;
      }
    } catch (err) {
      addToast(err.message || 'Error desconocido', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get a single survey by ID
  const getSurveyById = async (id) => {
    try {
      setLoading(true);
      const result = await surveyService.getSurveyById(id);

      if (result.success) {
        return result.data;
      } else {
        addToast(result.error || 'Error desconocido', 'error');
        return null;
      }
    } catch (err) {
      addToast(err.message || 'Error desconocido', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a survey
  const deleteSurvey = async (id) => {
    try {
      const result = await surveyService.deleteSurvey(id);
      if (result.success) {
        if (surveys.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          loadSurveys();
        }
        return true;
      } else {
        addToast(result.error || 'Error desconocido', 'error');
        return false;
      }
    } catch (err) {
      addToast(err.message || 'Error desconocido', 'error');
      return false;
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