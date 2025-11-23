// File upload service with real API calls
export const fileUploadService = {
  // Get list of files with pagination and search
  getFiles: async (params) => {
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
      let errorMessage = 'Error al obtener archivos';

      // Manejar códigos de error específicos en el servicio
      switch (response.status) {
        case 400:
          errorMessage = 'Error al obtener archivos';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = 'Error al obtener archivos';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    const responseJson = await response.json();
    return {
      success: true,
      data: {
        data: responseJson.data.files,
        meta: responseJson.data.meta
      },
      status: response.status
    };
  },

  // Upload a new file
  uploadFile: async (fileData) => {
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
      let errorMessage = 'Error al subir archivo';

      // Manejar códigos de error específicos en el servicio
      switch (response.status) {
        case 400:
          errorMessage = 'Solicitud incorrecta: Verifica los datos del archivo';
          break;
        case 404:
          errorMessage = 'No se encontró el archivo';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = 'Error al subir archivo';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    const result = await response.json();

    // Mensaje de éxito para el toast
    return {
      success: true,
      data: {data: result.data.files, meta: result.data.meta},
      message: 'Archivo subido exitosamente',
      status: response.status
    };
  },

  // Get a single file by ID
  getFileById: async (id) => {
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
      let errorMessage = 'Error al obtener archivo';

      // Manejar códigos de error específicos en el servicio
      switch (response.status) {
        case 404:
          errorMessage = 'Archivo no encontrado';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = 'Error al obtener archivo';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    const data = await response.json();

    return {
      success: true,
      data: data.data,
      status: response.status
    };
  },

  // Update an existing file
  updateFile: async (id, fileData) => {
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
      let errorMessage = 'Error al actualizar archivo';

      // Manejar códigos de error específicos en el servicio
      switch (response.status) {
        case 400:
          errorMessage = 'Solicitud incorrecta: Verifica los datos del archivo';
          break;
        case 404:
          errorMessage = 'Archivo no encontrado';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = 'Error al actualizar archivo';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    const result = await response.json();

    // Mensaje de éxito para el toast
    return {
      success: true,
      data: {data: result.data.files, meta: result.data.meta},
      message: 'Archivo actualizado exitosamente',
      status: response.status
    };
  },

  // Delete a file
  deleteFile: async (id) => {
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
      let errorMessage = 'Error al eliminar archivo';

      // Manejar códigos de error específicos en el servicio
      switch (response.status) {
        case 404:
          errorMessage = 'Archivo no encontrado';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = 'Error al eliminar archivo';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    // Mensaje de éxito para el toast
    return {
      success: true,
      message: 'Archivo eliminado exitosamente',
      deletedId: id,
      status: response.status
    };
  }
};