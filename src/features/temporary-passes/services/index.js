const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const temporaryPassesService = {
  async getPendingPasses() {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/club-members/temporary-passes/pending`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener pases temporales pendientes');
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data.temporaryPasses || [],
        total: data.data.total || 0,
      };
    } catch (error) {
      console.error('Error fetching pending temporary passes:', error);
      return {
        success: false,
        error: error.message,
        data: [],
        total: 0,
      };
    }
  },

  async approvePass(userId, expirationDate) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expireAt: expirationDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al aprobar el pase temporal');
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Error approving temporary pass:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  async rejectPass(memberId) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/club-members/${memberId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al rechazar el pase temporal');
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error('Error rejecting temporary pass:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
};
