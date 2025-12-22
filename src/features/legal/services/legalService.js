const API_URL = process.env.REACT_APP_API_URL;

export const legalService = {
  async getAllDocuments() {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/legal/documents`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || 'Error al cargar documentos',
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('getAllDocuments error:', error);
      return {
        success: false,
        error: 'Error de conexión con el servidor',
      };
    }
  },

  async createDocument(documentData) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/legal/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(documentData),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || 'Error al crear documento',
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('createDocument error:', error);
      return {
        success: false,
        error: 'Error de conexión con el servidor',
      };
    }
  },

  async createVersion(documentId, versionData) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/legal/documents/${documentId}/versions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(versionData),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || 'Error al crear versión',
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('createVersion error:', error);
      return {
        success: false,
        error: 'Error de conexión con el servidor',
      };
    }
  },

  async publishVersion(versionId) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/legal/versions/${versionId}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || 'Error al publicar versión',
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('publishVersion error:', error);
      return {
        success: false,
        error: 'Error de conexión con el servidor',
      };
    }
  },

  async getVersionAcceptances(versionId) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/legal/versions/${versionId}/acceptances`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error.message || 'Error al cargar aceptaciones',
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('getVersionAcceptances error:', error);
      return {
        success: false,
        error: 'Error de conexión con el servidor',
      };
    }
  },
};
