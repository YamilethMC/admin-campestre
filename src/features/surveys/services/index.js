import { 
  SurveyCategory, 
  SurveyPriority, 
  SurveyStatus, 
  SurveyQuestionType 
} from '../interfaces';

// Mock data provided by the user
export const mockSurveys = [
  {
    id: '1',
    title: 'Satisfacción con Servicios del Club',
    description: 'Ayúdanos a mejorar nuestros servicios compartiendo tu experiencia.',
    category: SurveyCategory.SERVICES,
    priority: SurveyPriority.IMPORTANT,
    estimatedTime: '3-5 min',
    participantCount: 156,
    questionCount: 8,
    isActive: true,
    imageUrl: '',
    averageRating: 4.2,
    dateCreated: '2024-10-01',
  },
  {
    id: '2',
    title: 'Calidad del Restaurante',
    description: 'Evalúa la calidad de nuestros alimentos y servicio en el restaurante.',
    category: SurveyCategory.RESTAURANT,
    priority: SurveyPriority.NORMAL,
    estimatedTime: '4-6 min',
    participantCount: 89,
    questionCount: 10,
    isActive: true,
    imageUrl: '',
    averageRating: 4.5,
    dateCreated: '2024-10-05',
  },
  {
    id: '3',
    title: 'Instalaciones Deportivas',
    description: 'Comparte tu opinión sobre nuestras instalaciones deportivas.',
    category: SurveyCategory.SPORTS,
    priority: SurveyPriority.URGENT,
    estimatedTime: '5-7 min',
    participantCount: 234,
    questionCount: 12,
    isActive: true,
    imageUrl: '',
    averageRating: 3.8,
    dateCreated: '2024-09-25',
  },
  {
    id: '4',
    title: 'Experiencia en Eventos',
    description: 'Ayúdanos a mejorar nuestros eventos y actividades.',
    category: SurveyCategory.EVENTS,
    priority: SurveyPriority.NORMAL,
    estimatedTime: '3-5 min',
    participantCount: 76,
    questionCount: 7,
    isActive: true,
    imageUrl: '',
    averageRating: 4.7,
    dateCreated: '2024-10-10',
  },
  {
    id: '5',
    title: 'Calidad del Servicio General',
    description: 'Evalúa el servicio general del club.',
    category: SurveyCategory.SERVICES,
    priority: SurveyPriority.LOW,
    estimatedTime: '4-6 min',
    participantCount: 321,
    questionCount: 9,
    isActive: false, // Completed survey
    imageUrl: '',
    averageRating: 4.0,
    dateCreated: '2024-08-15',
    dateCompleted: '2024-09-15',
  },
];

export const mockSurveyQuestions = [
  // Questions for survey 1
  {
    id: '1-1',
    surveyId: '1',
    question: '¿Cómo calificarías la atención del personal?',
    type: SurveyQuestionType.RATING,
    required: true,
  },
  {
    id: '1-2',
    surveyId: '1',
    question: '¿Qué servicios del club utilizas con mayor frecuencia?',
    type: SurveyQuestionType.MULTIPLE_CHOICE,
    options: ['Alberca', 'Gimnasio', 'Áreas sociales', 'Estacionamiento', 'Otros'],
    required: true,
  },
  {
    id: '1-3',
    surveyId: '1',
    question: '¿Tienes alguna sugerencia para mejorar nuestros servicios?',
    type: SurveyQuestionType.TEXT,
    required: false,
  },
  {
    id: '1-4',
    surveyId: '1',
    question: '¿Recomendarías nuestro club a amigos o familiares?',
    type: SurveyQuestionType.YES_NO,
    required: true,
  },
  {
    id: '1-5',
    surveyId: '1',
    question: '¿Tienes algún comentario adicional?',
    type: SurveyQuestionType.TEXT,
    required: false,
  },
  {
    id: '1-6',
    surveyId: '1',
    question: '¿Consideras que el costo-beneficio de nuestros servicios es adecuado?',
    type: SurveyQuestionType.RATING,
    required: true,
  },
  {
    id: '1-7',
    surveyId: '1',
    question: '¿Con qué frecuencia usas las instalaciones del club?',
    type: SurveyQuestionType.MULTIPLE_CHOICE,
    options: ['Diario', 'Varias veces por semana', 'Una vez por semana', 'Ocasionalmente', 'Raramente'],
    required: true,
  },
  {
    id: '1-8',
    surveyId: '1',
    question: '¿Tienes algún comentario adicional?',
    type: SurveyQuestionType.TEXT,
    required: false,
  },
  // Questions for survey 2
  {
    id: '2-1',
    surveyId: '2',
    question: '¿Cómo calificarías el sabor de los alimentos?',
    type: SurveyQuestionType.RATING,
    required: true,
  },
  {
    id: '2-2',
    surveyId: '2',
    question: '¿Qué tipo de platillos prefieres que ofrezcamos?',
    type: SurveyQuestionType.MULTIPLE_CHOICE,
    options: ['Internacional', 'Regional', 'Vegetariano', 'Opciones saludables', 'Todos los anteriores'],
    required: true,
  },
  {
    id: '2-3',
    surveyId: '2',
    question: '¿Cómo calificarías el tiempo de espera para recibir tu orden?',
    type: SurveyQuestionType.RATING,
    required: true,
  },
  {
    id: '2-4',
    surveyId: '2',
    question: '¿Te gustaría que ampliemos la carta de menú?',
    type: SurveyQuestionType.YES_NO,
    required: true,
  },
  {
    id: '2-5',
    surveyId: '2',
    question: '¿Cuál ha sido tu experiencia con el servicio al cliente en el restaurante?',
    type: SurveyQuestionType.TEXT,
    required: false,
  },
  {
    id: '2-6',
    surveyId: '2',
    question: '¿Qué horario prefieres para visitar el restaurante?',
    type: SurveyQuestionType.MULTIPLE_CHOICE,
    options: ['Desayuno', 'Comida', 'Cena', 'Todas las opciones'],
    required: true,
  },
  {
    id: '2-7',
    surveyId: '2',
    question: '¿El ambiente del restaurante es agradable?',
    type: SurveyQuestionType.YES_NO,
    required: true,
  },
  {
    id: '2-8',
    surveyId: '2',
    question: '¿Qué platillo recomendarías?',
    type: SurveyQuestionType.TEXT,
    required: false,
  },
  {
    id: '2-9',
    surveyId: '2',
    question: '¿Algún comentario adicional sobre el restaurante?',
    type: SurveyQuestionType.TEXT,
    required: false,
  },
  {
    id: '2-10',
    surveyId: '2',
    question: '¿Consideras que los precios son justos por la calidad ofrecida?',
    type: SurveyQuestionType.RATING,
    required: true,
  },
  // Questions for survey 3
  {
    id: '3-1',
    surveyId: '3',
    question: '¿Cómo calificarías el estado de las instalaciones deportivas?',
    type: SurveyQuestionType.RATING,
    required: true,
  },
  {
    id: '3-2',
    surveyId: '3',
    question: '¿Qué instalaciones deportivas usas con mayor frecuencia?',
    type: SurveyQuestionType.MULTIPLE_CHOICE,
    options: ['Gimnasio', 'Canchas de tenis', 'Área de yoga', 'Cancha de fútbol', 'Otras'],
    required: true,
  },
  {
    id: '3-3',
    surveyId: '3',
    question: '¿Te gustaría que adicionáramos nuevas instalaciones?',
    type: SurveyQuestionType.YES_NO,
    required: true,
  },
  {
    id: '3-4',
    surveyId: '3',
    question: '¿Cómo calificarías el horario de disponibilidad de las instalaciones?',
    type: SurveyQuestionType.RATING,
    required: true,
  },
  {
    id: '3-5',
    surveyId: '3',
    question: '¿Tienes sugerencias para mejorar las instalaciones deportivas?',
    type: SurveyQuestionType.TEXT,
    required: false,
  },
  {
    id: '3-6',
    surveyId: '3',
    question: '¿Qué equipo adicional te gustaría que tuviéramos disponible?',
    type: SurveyQuestionType.TEXT,
    required: false,
  },
  {
    id: '3-7',
    surveyId: '3',
    question: '¿Te gustaría tener más actividades deportivas organizadas?',
    type: SurveyQuestionType.YES_NO,
    required: true,
  },
  {
    id: '3-8',
    surveyId: '3',
    question: '¿Cómo calificarías la limpieza de las instalaciones?',
    type: SurveyQuestionType.RATING,
    required: true,
  },
  {
    id: '3-9',
    surveyId: '3',
    question: '¿Qué horario es más conveniente para ti?',
    type: SurveyQuestionType.MULTIPLE_CHOICE,
    options: ['Mañana', 'Tarde', 'Noche', 'Todos los horarios'],
    required: true,
  },
  {
    id: '3-10',
    surveyId: '3',
    question: '¿Te gustaría tener acceso a entrenadores o asesores?',
    type: SurveyQuestionType.YES_NO,
    required: true,
  },
  {
    id: '3-11',
    surveyId: '3',
    question: '¿Algún comentario adicional?',
    type: SurveyQuestionType.TEXT,
    required: false,
  },
  {
    id: '3-12',
    surveyId: '3',
    question: '¿Te gustaría que hubiera más eventos deportivos?',
    type: SurveyQuestionType.YES_NO,
    required: true,
  },
  // Questions for survey 4
  {
    id: '4-1',
    surveyId: '4',
    question: '¿Cómo calificarías los eventos organizados por el club?',
    type: SurveyQuestionType.RATING,
    required: true,
  },
  {
    id: '4-2',
    surveyId: '4',
    question: '¿Qué tipo de eventos te gustaría que organizáramos?',
    type: SurveyQuestionType.MULTIPLE_CHOICE,
    options: ['Familiares', 'Deportivos', 'Culturales', 'Sociales', 'Todos'],
    required: true,
  },
  {
    id: '4-3',
    surveyId: '4',
    question: '¿Con qué frecuencia asistes a los eventos del club?',
    type: SurveyQuestionType.MULTIPLE_CHOICE,
    options: ['Siempre', 'Frecuentemente', 'Ocasionalmente', 'Raramente', 'Nunca'],
    required: true,
  },
  {
    id: '4-4',
    surveyId: '4',
    question: '¿Te gustaría que hubiera más eventos para toda la familia?',
    type: SurveyQuestionType.YES_NO,
    required: true,
  },
  {
    id: '4-5',
    surveyId: '4',
    question: '¿Qué evento memorable has tenido en el club?',
    type: SurveyQuestionType.TEXT,
    required: false,
  },
  {
    id: '4-6',
    surveyId: '4',
    question: '¿Cómo calificarías la organización de los eventos?',
    type: SurveyQuestionType.RATING,
    required: true,
  },
  {
    id: '4-7',
    surveyId: '4',
    question: '¿Te gustaría participar en la planificación de eventos?',
    type: SurveyQuestionType.YES_NO,
    required: true,
  },
  // Questions for survey 5
  {
    id: '5-1',
    surveyId: '5',
    question: '¿Cómo calificarías el servicio general del club?',
    type: SurveyQuestionType.RATING,
    required: true,
  },
  {
    id: '5-2',
    surveyId: '5',
    question: '¿Qué aspectos del servicio destacarías?',
    type: SurveyQuestionType.TEXT,
    required: false,
  },
  {
    id: '5-3',
    surveyId: '5',
    question: '¿Qué aspectos consideras que necesitan mejora?',
    type: SurveyQuestionType.TEXT,
    required: false,
  },
  {
    id: '5-4',
    surveyId: '5',
    question: '¿Recomendarías el club a otros?',
    type: SurveyQuestionType.YES_NO,
    required: true,
  },
  {
    id: '5-5',
    surveyId: '5',
    question: '¿Qué cambiarías del club?',
    type: SurveyQuestionType.TEXT,
    required: false,
  },
  {
    id: '5-6',
    surveyId: '5',
    question: '¿Cómo calificarías la calidad-precio de los servicios?',
    type: SurveyQuestionType.RATING,
    required: true,
  },
  {
    id: '5-7',
    surveyId: '5',
    question: '¿Tienes alguna sugerencia para mejorar?',
    type: SurveyQuestionType.TEXT,
    required: false,
  },
  {
    id: '5-8',
    surveyId: '5',
    question: '¿Con qué frecuencia usas los servicios del club?',
    type: SurveyQuestionType.MULTIPLE_CHOICE,
    options: ['Diario', 'Varias veces por semana', 'Una vez por semana', 'Ocasionalmente', 'Casi nunca'],
    required: true,
  },
  {
    id: '5-9',
    surveyId: '5',
    question: '¿Consideras que el club cumple con tus expectativas?',
    type: SurveyQuestionType.YES_NO,
    required: true,
  },
];

// Service functions to mock API calls
export const surveyService = {
  // Get all surveys
  getSurveys: async (filters = {}) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredSurveys = [...mockSurveys];
    
    // Apply category filter
    if (filters.category && filters.category !== SurveyCategory.ALL) {
      filteredSurveys = filteredSurveys.filter(survey => survey.category === filters.category);
    }
    
    // Apply status filter
    if (filters.status) {
      if (filters.status === 'activas' || filters.status === SurveyStatus.ACTIVE) {
        filteredSurveys = filteredSurveys.filter(survey => survey.isActive);
      } else if (filters.status === 'inactivas' || filters.status === SurveyStatus.INACTIVE) {
        filteredSurveys = filteredSurveys.filter(survey => !survey.isActive);
      }
      // If status is 'todas' or 'all', no additional filtering is needed
    }
    
    return filteredSurveys;
  },

  // Get survey by id
  getSurveyById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const survey = mockSurveys.find(survey => survey.id === id);
    if (survey) {
      // Get questions for this survey
      const questions = mockSurveyQuestions.filter(q => q.surveyId === id);
      // Return survey with questions
      return { 
        ...survey, 
        questions: questions
      };
    }
    return null;
  },

  // Get questions for a specific survey
  getSurveyQuestions: async (surveyId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockSurveyQuestions.filter(question => question.surveyId === surveyId);
  },

  // Create a new survey
  createSurvey: async (surveyData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newSurvey = {
      id: Date.now().toString(), // Generate a new ID
      ...surveyData,
      questionCount: surveyData.questions ? surveyData.questions.length : 0,
      participantCount: surveyData.participantCount || 0, // Preserve participant count if provided
      averageRating: surveyData.averageRating || 0, // Preserve average rating if provided
      dateCreated: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
    };
    
    // Add the new survey to our mock data
    mockSurveys.push(newSurvey);
    
    // Add questions if provided
    if (surveyData.questions) {
      surveyData.questions.forEach((question, index) => {
        const questionId = `${newSurvey.id}-${index + 1}`;
        mockSurveyQuestions.push({
          id: questionId,
          surveyId: newSurvey.id,
          question: question.question,
          type: question.type,
          options: question.options || [],
          required: question.required
        });
      });
    }
    
    return newSurvey;
  },

  // Update a survey
  updateSurvey: async (id, surveyData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const surveyIndex = mockSurveys.findIndex(survey => survey.id === id);
    if (surveyIndex === -1) return null;
    
    // Preserve original values that shouldn't be changed
    const originalSurvey = mockSurveys[surveyIndex];
    
    // Update the survey preserving important fields
    mockSurveys[surveyIndex] = {
      ...surveyData,
      id: id,
      dateCreated: originalSurvey.dateCreated, // Preserve original creation date
      participantCount: originalSurvey.participantCount, // Preserve participant count
      averageRating: originalSurvey.averageRating, // Preserve average rating
      questionCount: surveyData.questions ? surveyData.questions.length : 0,
    };
    
    // Update the questions for this survey
    // Remove old questions first
    const oldQuestions = mockSurveyQuestions.filter(q => q.surveyId === id);
    oldQuestions.forEach(question => {
      const questionIndex = mockSurveyQuestions.findIndex(q => q.id === question.id);
      if (questionIndex !== -1) {
        mockSurveyQuestions.splice(questionIndex, 1);
      }
    });
    
    // Add updated questions
    if (surveyData.questions) {
      surveyData.questions.forEach((question, index) => {
        const questionId = `${id}-${index + 1}`;
        mockSurveyQuestions.push({
          id: questionId,
          surveyId: id,
          question: question.question,
          type: question.type,
          options: question.options || [],
          required: question.required
        });
      });
    }
    
    return mockSurveys[surveyIndex];
  },

  // Toggle survey status (activate/deactivate)
  toggleSurveyStatus: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const surveyIndex = mockSurveys.findIndex(survey => survey.id === id);
    if (surveyIndex === -1) return null;
    
    mockSurveys[surveyIndex].isActive = !mockSurveys[surveyIndex].isActive;
    return mockSurveys[surveyIndex];
  },

  // Get survey statistics for the header
  getSurveyStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const activeCount = mockSurveys.filter(survey => survey.isActive).length;
    const inactiveCount = mockSurveys.filter(survey => !survey.isActive).length;
    
    return {
      active: activeCount,
      inactive: inactiveCount
    };
  },

  // Delete a survey
  deleteSurvey: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const surveyIndex = mockSurveys.findIndex(survey => survey.id === id);
    if (surveyIndex === -1) return false;
    
    // Remove the survey
    mockSurveys.splice(surveyIndex, 1);
    
    // Remove all questions associated with this survey
    const questionsToRemove = mockSurveyQuestions.filter(q => q.surveyId === id);
    questionsToRemove.forEach(question => {
      const questionIndex = mockSurveyQuestions.findIndex(q => q.id === question.id);
      if (questionIndex !== -1) {
        mockSurveyQuestions.splice(questionIndex, 1);
      }
    });
    
    return true;
  },
  
  // Get all responses for a survey (for the responses view)
  getSurveyResponses: async (surveyId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find the survey to get the participant count
    const survey = mockSurveys.find(s => s.id === surveyId);
    if (!survey) return [];
    
    // Get the actual questions to know their type and required status
    const questions = mockSurveyQuestions.filter(q => q.surveyId === surveyId);
    
    // Generate mock responses for each question
    const responses = questions.map(question => {
      // For required questions, have responses matching the participant count
      // For non-required questions (especially text/open questions), just have 1 for this exercise
      const responseCount = question.required ? survey.participantCount : 1; 
      
      // For demo purposes only, in a real app this would come from actual responses
      return {
        questionId: question.id,
        question: question.question,
        type: question.type,
        required: question.required,
        responses: Array.from({ length: responseCount }, (_, i) => ({
          id: `response-${question.id}-${i + 1}`,
          value: generateMockResponse(question),
          date: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // Random date in past week
          participant: `Participante ${i + 1}`
        }))
      };
    });
    
    return responses;
  }
};

// Helper function to generate mock responses based on question type
function generateMockResponse(question) {
  switch (question.type) {
    case SurveyQuestionType.RATING:
      return (Math.random() * 9 + 1).toFixed(1); // Random rating from 1 to 10
    case SurveyQuestionType.MULTIPLE_CHOICE:
      if (question.options && question.options.length > 0) {
        return question.options[Math.floor(Math.random() * question.options.length)];
      }
      return 'Opción desconocida';
    case SurveyQuestionType.YES_NO:
      return Math.random() > 0.5 ? 'Sí' : 'No';
    case SurveyQuestionType.TEXT:
      return `Respuesta de ejemplo para la pregunta "${question.question}"`;
    default:
      return 'Respuesta desconocida';
  }
}