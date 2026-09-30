import { leerAcceso, renovarSesion } from './sesion';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

const buildUrl = (path) => {
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  return `${API_BASE_URL}${path}`;
};

const getAuthHeaders = () => {
  const token = leerAcceso();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  return {
    ok: response.ok,
    status: response.status,
    data,
  };
};

/**
 * Rutas que nunca se reintentan tras un 401.
 *
 * Renovar la sesión porque falló el propio login sería un bucle; y si la que
 * falla es la renovación, ya no hay a qué agarrarse.
 */
const SIN_REINTENTO = ['/auth/login', '/auth/refresh', '/auth/logout'];

const lanzar = (path, { method, headers, body, signal }, token) =>
  fetch(buildUrl(path), {
    method,
    headers: {
      ...defaultHeaders,
      ...(token ? { Authorization: `Bearer ${token}` } : getAuthHeaders()),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

/**
 * Hace la petición y, si el token caducó, lo renueva y la repite una vez.
 *
 * Antes no había renovación: el panel recibía el refresh token al entrar y lo
 * tiraba, así que a las 24 horas el token moría y sacaba al usuario al login a
 * media captura. El backend ya tenía todo el mecanismo desde la Fase 4 —con
 * rotación y detección de reuso—; sólo faltaba que el panel lo usara.
 */
const request = async (path, options = {}) => {
  const { method = 'GET', headers = {}, body, signal } = options;
  const opciones = { method, headers, body, signal };

  const respuesta = await lanzar(path, opciones);

  if (respuesta.status !== 401 || SIN_REINTENTO.some((r) => path.startsWith(r))) {
    return handleResponse(respuesta);
  }

  const nuevoToken = await renovarSesion(API_BASE_URL);

  if (!nuevoToken) {
    // No se pudo renovar: se devuelve el 401 y quien llamó decide
    // (los servicios llaman a handleAuthError y mandan al login).
    return handleResponse(respuesta);
  }

  return handleResponse(await lanzar(path, opciones, nuevoToken));
};

const api = {
  get: (path, options = {}) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options = {}) => request(path, { ...options, method: 'POST', body }),
  patch: (path, body, options = {}) => request(path, { ...options, method: 'PATCH', body }),
  del: (path, options = {}) => request(path, { ...options, method: 'DELETE' }),
  request,
};

export default api;
