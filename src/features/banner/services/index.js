import api from '../../../shared/api/api';

export const bannerService = {
  fetchBanners: async ({ page = 1, limit = 10, orderBy = 'createdAt', order = 'asc', active = true, search = '' } = {}) => {
    const params = new URLSearchParams({ page, limit, search, order, orderBy });
    if (typeof active === 'boolean') params.append("active", active);

    const response = await api.get(`/banner?${params}`);

    if (!response.ok) {
      let errorMessage = response.data?.message || 'Error al obtener banners';
      if (response.status === 500) errorMessage = 'Error interno del servidor: Por favor intenta más tarde';

      return { success: false, error: errorMessage, status: response.status };
    }

    return {
      success: true,
      data: {
        data: response.data.data?.data || response.data.data || [],
        meta: response.data.data?.meta || response.data.meta || null
      },
      status: response.status
    };
  },

  getBannerById: async (id) => {
    const response = await api.get(`/banner/${id}`);

    if (!response.ok) {
      let errorMessage = response.data?.message || 'Error al obtener banner';
      if (response.status === 404) errorMessage = 'Banner no encontrado';
      else if (response.status === 500) errorMessage = 'Error interno del servidor: Por favor intenta más tarde';

      return { success: false, error: errorMessage, status: response.status };
    }

    return { success: true, data: response.data.data, status: response.status };
  },

  createBanner: async (bannerData) => {
    const formattedData = {
      ...bannerData,
      startDate: bannerData.startDate ? (new Date(bannerData.startDate)).toISOString() : null,
      endDate: bannerData.endDate ? (new Date(bannerData.endDate)).toISOString() : null
    };

    const response = await api.post('/banner', formattedData);

    if (!response.ok) {
      let errorMessage = response.data?.message || 'Error al registrar banner';
      if (response.status === 400) errorMessage = 'Solicitud incorrecta: Verifica los datos proporcionados';
      else if (response.status === 409) errorMessage = 'El banner ya existe';
      else if (response.status === 500) errorMessage = 'Error interno del servidor: Por favor intenta más tarde';

      return { success: false, error: errorMessage, status: response.status };
    }

    return {
      success: true,
      data: response.data.data || response.data,
      message: 'Banner registrado exitosamente',
      status: response.status
    };
  },

  updateBanner: async (id, bannerData) => {
    const formattedData = {
      ...bannerData,
      startDate: bannerData.startDate ? (new Date(bannerData.startDate)).toISOString() : null,
      endDate: bannerData.endDate ? (new Date(bannerData.endDate)).toISOString() : null
    };

    const response = await api.patch(`/banner/${id}`, formattedData);

    if (!response.ok) {
      let errorMessage = response.data?.message || 'Error al actualizar banner';
      if (response.status === 404) errorMessage = 'Banner no encontrado';
      else if (response.status === 500) errorMessage = 'Error interno del servidor: Por favor intenta más tarde';

      return { success: false, error: errorMessage, status: response.status };
    }

    return {
      success: true,
      data: response.data.data || response.data,
      message: 'Banner actualizado exitosamente',
      status: response.status
    };
  },

  deleteBanner: async (id) => {
    const response = await api.del(`/banner/${id}`);

    if (!response.ok) {
      let errorMessage = response.data?.message || 'Error al eliminar el banner';
      if (response.status === 404) errorMessage = 'Banner no encontrado';
      else if (response.status === 500) errorMessage = 'Error interno del servidor: Por favor intenta más tarde';

      return { success: false, error: errorMessage, status: response.status };
    }

    return { success: true, message: 'Banner eliminado exitosamente', status: response.status };
  },
};