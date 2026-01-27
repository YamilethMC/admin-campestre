import api from '../../../shared/api/api';

export const memberService = {
    async fetchMembers({
        page = 1,
        limit = 10,
        orderBy = 'name',
        order = 'asc',
        active = true,
        search = ''
    } = {}) {
        const params = new URLSearchParams({
            page,
            limit,
            search,
            order,
            orderBy,
            active
        });

        const response = await api.get(`/club-members?${params.toString()}`);

        if (!response.ok) {
            let errorMessage = response.data?.message || 'Error al obtener miembros';
            if (response.status === 500) {
                errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
            }

            return {
                success: false,
                error: errorMessage,
                status: response.status
            };
        }

        const payload = response.data?.data || {};
        return {
            success: true,
            members: payload.members || [],
            meta: payload.meta || {},
            status: response.status
        };
    },

    async deleteMember(id) {
        const response = await api.del(`/club-members/${id}`);

        if (!response.ok) {
            let errorMessage = response.data?.message || 'Error al eliminar miembro';
            
            switch (response.status) {
                case 404:
                    errorMessage = 'Miembro no encontrado';
                    break;
                case 500:
                    errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
                    break;
                default:
                    errorMessage = response.data?.message || 'Error al eliminar miembro';
            }

            return {
                success: false,
                error: errorMessage,
                status: response.status
            };
        }

        return {
            success: true,
            message: 'Miembro eliminado exitosamente',
            status: response.status
        };
    }
};
