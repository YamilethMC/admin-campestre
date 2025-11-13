// File upload service with real API calls
export const fileUploadService = {
  // Get list of files with pagination and search
  getFiles: async (params) => {
    try {
      // Extract params with defaults
      const { page = 1, limit = 10, search = '', order = 'asc', orderBy = 'name' } = params;

      // Get auth token
      const token = localStorage.getItem('authToken');
      
      // Build query parameters
      let query = `${process.env.REACT_APP_API_URL}/files?page=${page}&limit=${limit}&search=${search}&order=${order}&orderBy=${orderBy}`;
      
      const response = await fetch(query, {
        headers: {
          "accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener archivos');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error getting files:', error);
      throw error;
    }
  },

  // Upload a new file
  uploadFile: async (fileData) => {
    try {
      // Get auth token
      const token = localStorage.getItem('authToken');
      
      // Create FormData for file upload
      const formData = new FormData();
      if (fileData.file) {
        formData.append('file', fileData.file);
      }
      formData.append('name', fileData.name);
      formData.append('description', fileData.description || '');
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/files/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al subir archivo');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Get a single file by ID
  getFileById: async (id) => {
    try {
      // Get auth token
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/files/${id}`, {
        headers: {
          "accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener archivo');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error getting file by ID:', error);
      throw error;
    }
  },

  // Update an existing file
  updateFile: async (id, fileData) => {
    try {
      // Get auth token
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/files/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: fileData.name,
          description: fileData.description,
          type: fileData.type || 'pdf'  // Default to 'pdf' if not provided
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar archivo');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating file:', error);
      throw error;
    }
  },

  // Delete a file
  deleteFile: async (id) => {
    try {
      // Get auth token
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/files/${id}`, {
        method: "DELETE",
        headers: {
          "accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar archivo');
      }

      return { success: true, deletedId: id };
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
};