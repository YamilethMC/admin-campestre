// Service functions to connect to real API
export const noticeService = {
  // Get all notices with pagination, search, and filters
  fetchNotices: async ({
    page = 1,
    limit = 10,
    search = '',
    active = true, // Default to active notices
    order = 'asc',
    orderBy = 'name'
  } = {}) => {
    const token = localStorage.getItem("authToken");

    // Build query parameters
    let query = `${process.env.REACT_APP_API_URL}/notify?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&order=${order}&orderBy=${orderBy}&active=${active}`;

    const response = await fetch(query, {
      headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener avisos');
    }

    const responseData = await response.json();
    // API returns { success: true, data: { notices: [...], meta: {...} }, ... }
    // We need to return { data: [...], meta: {...} } to match the expected format
    return {
      data: responseData.data.notices || [],
      meta: responseData.data.meta || null
    };
  },

  // Get notice by id
  getNoticeById: async (id) => {
    const token = localStorage.getItem("authToken");
    
    const response = await fetch(`${process.env.REACT_APP_API_URL}/notify/${id}`, {
      headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener aviso');
    }

    const responseData = await response.json();
    return responseData.data;
  },

  // Create a new notice
  createNotice: async (noticeData) => {
    const token = localStorage.getItem("authToken");
    
    const response = await fetch(`${process.env.REACT_APP_API_URL}/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(noticeData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al registrar aviso');
    }
    
    const result = await response.json();
    return result.data;
  },

  // Update a notice
  updateNotice: async (id, noticeData) => {
    const token = localStorage.getItem("authToken");
    
    const response = await fetch(`${process.env.REACT_APP_API_URL}/notify/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(noticeData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar aviso');
    }
    
    const result = await response.json();
    return result.data;
  },

  // Toggle notice status (activate/deactivate)
  toggleNoticeStatus: async (id, active) => {
    const token = localStorage.getItem("authToken");
    
    const response = await fetch(`${process.env.REACT_APP_API_URL}/notify/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ active }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar estado del aviso');
    }

    const result = await response.json();
    return result.data;
  },

  // Get notice statistics for the header
  getNoticeStats: async () => {
    const token = localStorage.getItem("authToken");
    
    // Get both active and inactive notices to calculate stats
    const response = await fetch(`${process.env.REACT_APP_API_URL}/notify?page=1&limit=9999&active=true`, {
      headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener estadísticas de avisos');
    }

    const activeResponse = await response.json();
    const activeCount = Array.isArray(activeResponse.data.notices) ? activeResponse.data.notices.length : 0;

    const inactiveResponse = await fetch(`${process.env.REACT_APP_API_URL}/notify?page=1&limit=9999&active=false`, {
      headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!inactiveResponse.ok) {
      const errorData = await inactiveResponse.json();
      throw new Error(errorData.message || 'Error al obtener estadísticas de avisos');
    }

    const inactiveData = await inactiveResponse.json();
    const inactiveCount = Array.isArray(inactiveData.data.notices) ? inactiveData.data.notices.length : 0;

    return {
      active: activeCount,
      inactive: inactiveCount
    };
  },

  // Delete a notice
  deleteNotice: async (id) => {
    const token = localStorage.getItem("authToken");
    
    const response = await fetch(`${process.env.REACT_APP_API_URL}/notify/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar el aviso');
    }
    
    return true;
  },
};