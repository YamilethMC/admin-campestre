// Event types
export const EventTypes = {
  SOCIAL: 'SOCIAL',
  SPORT: 'SPORT',
  FAMILY: 'FAMILY',
  OTHER: 'OTHER',
  ALL: 'TODAS',
  BUSINESS: 'BUSINESS'
};

// Event interface
export const EventInterface = {
  id: null,
  type: '',
  name: '',
  description: '',
  date: '', // Formatted date like "domingo, 30 de noviembre de 2025"
  dateISO: '', // ISO format like "2025-11-30T14:00:00.000Z"
  totalSpots: 0,
  location: '',
  createdAt: '',
  updatedAt: '',
  availableSpots: 0,
  ocupedSpots: 0
};

// Event registration interface
export const EventRegistrationInterface = {
  id: null,
  eventId: null,
  clubMemberId: null,
  totalRegistrations: 0,
  createdAt: '',
  updatedAt: ''
};

// Event form data interface
export const EventFormData = {
  type: '',
  name: '',
  description: '',
  date: '', // ISO format date string
  totalSpots: 0,
  location: ''
};

// Event filter interface
export const EventFilterInterface = {
  search: '',
  type: EventTypes.ALL,
  date: '', // Format: "YYYY-MM"
  page: 1,
  limit: 10
};

// Event response interface
export const EventResponseInterface = {
  success: false,
  data: {
    events: [],
    meta: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1
    }
  },
  timestamp: '',
  messageId: '',
  traceId: ''
};

// Event registration response interface
export const EventRegistrationResponseInterface = {
  success: false,
  data: {
    message: '',
    eventName: '',
    memberId: null,
    totalRegistrations: 0,
    availableSpots: 0
  },
  timestamp: '',
  messageId: '',
  traceId: ''
};

export const EventTypesOptions = [
  { value: EventTypes.ALL, label: 'Todas' },
  { value: EventTypes.SOCIAL, label: 'Social' },
  { value: EventTypes.SPORT, label: 'Deporte' },
  { value: EventTypes.FAMILY, label: 'Familiar' },
  { value: EventTypes.OTHER, label: 'Otro' },
  { value: EventTypes.BUSINESS, label: 'Negocios' } 
];