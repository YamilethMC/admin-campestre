export const SurveyCategory = {
  ALL: 'Todas',
  SERVICES: 'Servicios',
  RESTAURANT: 'Restaurante',
  SPORTS: 'Deportes',
  EVENTS: 'Eventos',
};

export const SurveyPriority = {
  HIGH: 'Importante',
  MEDIUM: 'Normal',
  LOW: 'Baja',
};

export const SurveyStatus = {
  ACTIVE: 'activas',
  INACTIVE: 'inactivas',
  ALL: 'todas',
};

export const SurveyQuestionType = {
  NUMBER: 'NUMBER', // 1-10 range
  SELECT: 'SELECT',
  TEXT: 'TEXT', // open question
  BOOLEAN: 'BOOLEAN',
};

export const SurveyFilter = {
  category: SurveyCategory.ALL,
  status: SurveyStatus.ALL,
};

// Survey interface
export const surveyInterface = {
  id: '',
  title: '',
  description: '',
  category: SurveyCategory.SERVICES,
  priority: SurveyPriority.MEDIUM,
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
