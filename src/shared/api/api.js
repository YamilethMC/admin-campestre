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
  const token = localStorage.getItem('authToken') || null;
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

const request = async (path, options = {}) => {
  const { method = 'GET', headers = {}, body } = options;
  const response = await fetch(buildUrl(path), {
    method,
    headers: {
      ...defaultHeaders,
      ...getAuthHeaders(),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse(response);
};

const api = {
  get: (path, options = {}) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options = {}) => request(path, { ...options, method: 'POST', body }),
  patch: (path, body, options = {}) => request(path, { ...options, method: 'PATCH', body }),
  del: (path, options = {}) => request(path, { ...options, method: 'DELETE' }),
  request,
};

export default api;
