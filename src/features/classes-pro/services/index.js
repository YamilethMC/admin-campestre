import api from '../../../shared/api/api';
import { handleAuthError } from '../../../shared/utils/authErrorHandler';

const BASE = '/classes/pro';

/**
 * Lo que el profesor consulta de su propia agenda.
 *
 * Va contra `/classes/pro`, no contra `/admin/classes`: el backend impone ahí
 * el profesional del token y no acepta uno por parámetro, así que desde aquí
 * nunca se manda un id. Aunque se mandara, el servidor lo ignora.
 */
const messageFor = (status, fallback) => {
  switch (status) {
    case 403:
      return 'Tu cuenta no está ligada a una ficha de profesor. Avísale al Club.';
    case 400:
      return 'Las fechas no son válidas';
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

    return { success: true, data: response.data?.data ?? response.data };
  } catch (error) {
    return { success: false, error: 'No se pudo conectar con el servidor' };
  }
};

export const classesProService = {
  getMyAgenda: ({ from, to }) => {
    const params = new URLSearchParams({ from, to });
    return request(() => api.get(`${BASE}/agenda?${params.toString()}`), 'Error al cargar tu agenda');
  },

  markAttendance: (bookingId, attended, notes) =>
    request(
      () => api.patch(`${BASE}/bookings/${bookingId}/attendance`, { attended, notes }),
      'No se pudo reportar la asistencia',
    ),

  markPayment: (bookingId, paid, notes) =>
    request(
      () => api.patch(`${BASE}/bookings/${bookingId}/payment`, { paid, notes }),
      'No se pudo reportar el pago',
    ),

  reportUnpaid: (bookingId, notes) =>
    request(
      () => api.post(`${BASE}/bookings/${bookingId}/unpaid`, { notes }),
      'No se pudo reportar el impago',
    ),

  weatherCancel: (bookingId, notes) =>
    request(
      () => api.post(`${BASE}/bookings/${bookingId}/weather-cancel`, { notes }),
      'No se pudo cancelar la clase',
    ),
};

export default classesProService;
