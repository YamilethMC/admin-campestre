import api from '../../../shared/api/api';
import { handleAuthError } from '../../../shared/utils/authErrorHandler';

const BASE = '/admin/classes';

/**
 * Llamadas al backoffice del módulo de Clases.
 *
 * Una sola puerta para hablar con el backend: centraliza el manejo de la sesión
 * expirada y de los mensajes de error, en vez de repetir el mismo bloque en cada
 * método como pasa en otros módulos del panel.
 */
const messageFor = (status, fallback) => {
  switch (status) {
    case 400:
      return 'Los datos enviados no son válidos';
    case 403:
      return 'No tienes permiso para administrar las clases';
    case 404:
      return 'No encontramos lo que buscabas';
    case 500:
      return 'Error del servidor. Intenta más tarde';
    default:
      return fallback;
  }
};

const request = async (call, fallbackError) => {
  try {
    const response = await call();

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError();
        return { success: false, error: 'No autorizado: sesión expirada', status: 401 };
      }

      const raw = response.data?.message;
      const message = Array.isArray(raw) ? raw[0] : raw;

      return {
        success: false,
        error: message || messageFor(response.status, fallbackError),
        status: response.status,
      };
    }

    // El backend envuelve todo en { success, data, timestamp, ... }
    return { success: true, data: response.data?.data ?? response.data };
  } catch (error) {
    return { success: false, error: 'No se pudo conectar con el servidor' };
  }
};

export const classesService = {
  // Disciplinas
  getDisciplines: () => request(() => api.get(`${BASE}/disciplines`), 'Error al cargar las disciplinas'),

  // Profesionales
  getProfessionals: (disciplineId) =>
    request(
      () => api.get(`${BASE}/professionals${disciplineId ? `?disciplineId=${disciplineId}` : ''}`),
      'Error al cargar los profesionales',
    ),

  createProfessional: (payload) =>
    request(() => api.post(`${BASE}/professionals`, payload), 'Error al crear el profesional'),

  updateProfessional: (id, payload) =>
    request(() => api.patch(`${BASE}/professionals/${id}`, payload), 'Error al actualizar el profesional'),

  // Políticas de operación (§5)
  getPolicies: () =>
    request(() => api.get(`${BASE}/policies`), 'Error al cargar las reglas'),

  saveGeneralPolicy: (payload) =>
    request(() => api.request(`${BASE}/policies`, { method: 'PUT', body: payload }),
      'Error al guardar las reglas'),

  saveDisciplinePolicy: (disciplineId, payload) =>
    request(() => api.request(`${BASE}/disciplines/${disciplineId}/policy`, { method: 'PUT', body: payload }),
      'Error al guardar las reglas de la disciplina'),

  removeDisciplinePolicy: (disciplineId) =>
    request(() => api.del(`${BASE}/disciplines/${disciplineId}/policy`),
      'Error al quitar las reglas de la disciplina'),

  // Acceso del profesor al panel
  grantAccess: (professionalId, payload) =>
    request(
      () => api.post(`${BASE}/professionals/${professionalId}/access`, payload),
      'Error al dar el acceso',
    ),

  revokeAccess: (professionalId) =>
    request(
      () => api.del(`${BASE}/professionals/${professionalId}/access`),
      'Error al quitar el acceso',
    ),

  // Horario semanal
  getSchedule: (professionalId) =>
    request(() => api.get(`${BASE}/professionals/${professionalId}/schedule`), 'Error al cargar el horario'),

  replaceSchedule: (professionalId, blocks) =>
    request(
      () => api.request(`${BASE}/professionals/${professionalId}/schedule`, { method: 'PUT', body: { blocks } }),
      'Error al guardar el horario',
    ),

  // Excepciones
  getExceptions: (professionalId) =>
    request(() => api.get(`${BASE}/professionals/${professionalId}/exceptions`), 'Error al cargar los bloqueos'),

  createException: (professionalId, payload) =>
    request(() => api.post(`${BASE}/professionals/${professionalId}/exceptions`, payload), 'Error al crear el bloqueo'),

  deleteException: (exceptionId) =>
    request(() => api.del(`${BASE}/exceptions/${exceptionId}`), 'Error al quitar el bloqueo'),

  // Precios
  getPrices: () => request(() => api.get(`${BASE}/prices`), 'Error al cargar los precios'),

  replacePrices: (prices) =>
    request(() => api.request(`${BASE}/prices`, { method: 'PUT', body: { prices } }), 'Error al guardar los precios'),

  // Agenda
  getAgenda: ({ professionalId, from, to }) => {
    const params = new URLSearchParams({ from, to });
    if (professionalId) params.append('professionalId', professionalId);
    return request(() => api.get(`${BASE}/agenda?${params.toString()}`), 'Error al cargar la agenda');
  },
};

export default classesService;
