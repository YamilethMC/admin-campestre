import api from '../../../shared/api/api';

export const temporaryPassesService = {
  async getPendingPasses() {
    const response = await api.get('/club-members/temporary-passes/pending');

    if (!response.ok) {
      return {
        success: false,
        error: response.data?.message || 'Error al obtener pases temporales pendientes',
        data: [],
        total: 0,
      };
    }

    return {
      success: true,
      data: response.data.data.temporaryPasses || [],
      total: response.data.data.total || 0,
    };
  },

  async approvePass(userId, expirationDate) {
    const response = await api.patch(`/users/${userId}`, { expireAt: expirationDate });

    if (!response.ok) {
      return {
        success: false,
        error: response.data?.message || 'Error al aprobar el pase temporal',
      };
    }

    return {
      success: true,
      data: response.data,
    };
  },

  async rejectPass(memberId) {
    const response = await api.del(`/club-members/${memberId}`);

    if (!response.ok) {
      return {
        success: false,
        error: response.data?.message || 'Error al rechazar el pase temporal',
      };
    }

    return { success: true };
  },
};
