export const memberService = {
    async fetchMembers
    ({
        page = 1,
        limit = 10,
        orderBy = 'name',
        order = 'asc',
        active = true,
        search = ''
    } = {}) {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
            `${process.env.REACT_APP_API_URL}/club-members?page=${page}&limit=${limit}&search=${search}&order=${order}&orderBy=${orderBy}&active=${active}`,
            {
            headers: {
                "accept": "*/*",
                "Authorization": `Bearer ${token}`
            }}
        );

        if (!response.ok) {
            const error = await response.json();
            let errorMessage = error.message || 'Error al obtener miembros';

            switch (response.status) {
                case 500:
                    errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
                    break;
                default:
                    errorMessage = error.message || 'Error al obtener miembros';
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

    async deleteMember(id) {
        const token = localStorage.getItem("authToken");

        const response = await fetch(
            `${process.env.REACT_APP_API_URL}/club-members/${id}`,
            {
                method: "DELETE",
                headers: {
                    "accept": "*/*",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            const error = await response.json();
            let errorMessage = error.message || 'Error al eliminar miembro';

            switch (response.status) {
                case 404:
                    errorMessage = 'Miembro no encontrado';
                    break;
                case 500:
                    errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
                    break;
                default:
                    errorMessage = error.message || 'Error al eliminar miembro';
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
