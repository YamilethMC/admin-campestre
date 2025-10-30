export const SurveyCategory = {
  ALL: 'Todas',
  SERVICES: 'Servicios',
  RESTAURANT: 'Restaurante',
  SPORTS: 'Deportes',
  EVENTS: 'Eventos'
};

export const SurveyPriority = {
  URGENT: 'Urgente',
  IMPORTANT: 'Importante',
  NORMAL: 'Normal',
  LOW: 'Baja',
};

export const SurveyStatus = {
  ACTIVE: 'activas',
  INACTIVE: 'inactivas',
  ALL: 'todas'
};

export const SurveyQuestionType = {
  RATING: 'rating', // 1-10 range
  MULTIPLE_CHOICE: 'multiple-choice',
  TEXT: 'text', // open question
  YES_NO: 'yes-no'
};

export const SurveyFilter = {
  category: SurveyCategory.ALL,
  status: SurveyStatus.ALL
};

// Survey interface
export const surveyInterface = {
  id: '',
  title: '',
  description: '',
  category: SurveyCategory.SERVICES,
  priority: SurveyPriority.NORMAL,
  estimatedTime: '',
  participantCount: 0,
  questionCount: 0,
  isActive: true,
  imageUrl: '',
  averageRating: 0,
  dateCreated: '',
  dateCompleted: null,
};

// SurveyQuestion interface
export const surveyQuestionInterface = {
  id: '',
  surveyId: '',
  question: '',
  type: SurveyQuestionType.TEXT,
  options: [], // For multiple-choice questions
  required: true,
};