const API_URL = process.env.REACT_APP_API_URL;

export const ErrorAction = {
  RETRY: 'RETRY',
  LOGIN: 'LOGIN',
  CONTACT_SUPPORT: 'CONTACT_SUPPORT',
  UPDATE_APP: 'UPDATE_APP',
  NONE: 'NONE',
};

class ApiClient {
  constructor() {
    this.baseURL = API_URL;
    this.onUnauthorized = null;
    this.onError = null;
  }

  setOnUnauthorized(callback) {
    this.onUnauthorized = callback;
  }

  setOnError(callback) {
    this.onError = callback;
  }

  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  async handleResponse(response) {
    if (response.status === 401) {
      if (this.onUnauthorized) {
        this.onUnauthorized();
      }
      throw {
        success: false,
        errorCode: 'UNAUTHORIZED',
        message: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
        action: ErrorAction.LOGIN,
      };
    }

    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      if (isJson) {
        const errorData = await response.json();
        throw errorData;
      } else {
        throw {
          success: false,
          errorCode: `HTTP_${response.status}`,
          message: `Error del servidor (${response.status})`,
          action: ErrorAction.RETRY,
        };
      }
    }

    if (isJson) {
      return await response.json();
    }

    return response;
  }

  async handleError(error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      const networkError = {
        success: false,
        errorCode: 'NETWORK_ERROR',
        message: 'Error de conexión con el servidor. Por favor intenta más tarde.',
        action: ErrorAction.RETRY,
      };

      if (this.onError) {
        this.onError(networkError);
      }

      throw networkError;
    }

    if (this.onError && error.success === false) {
      this.onError(error);
    }

    throw error;
  }

  async get(endpoint, options = {}) {
    const token = this.getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers,
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      return await this.handleError(error);
    }
  }

  async post(endpoint, data, options = {}) {
    const token = this.getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: data ? JSON.stringify(data) : undefined,
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      return await this.handleError(error);
    }
  }

  async put(endpoint, data, options = {}) {
    const token = this.getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: data ? JSON.stringify(data) : undefined,
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      return await this.handleError(error);
    }
  }

  async patch(endpoint, data, options = {}) {
    const token = this.getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PATCH',
        headers,
        body: data ? JSON.stringify(data) : undefined,
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      return await this.handleError(error);
    }
  }

  async delete(endpoint, options = {}) {
    const token = this.getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers,
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      return await this.handleError(error);
    }
  }
}

export const apiClient = new ApiClient();
