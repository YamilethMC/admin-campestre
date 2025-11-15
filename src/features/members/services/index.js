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
            `${process.env.REACT_APP_API_URL}/club-members?page=${page}&limit=${limit}&search=${search}&orderBy=${orderBy}&order=${order}&active=${active}`,
            {
            headers: {
                "accept": "*/*",
                "Authorization": `Bearer ${token}`
            }
            }
        );

        if (!response.ok) {
            throw new Error("Error al obtener miembros");
        }

        const data = await response.json();
        return data.data; // contiene members + meta
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
        if (!response.ok) throw new Error("Error al eliminar miembro");

        return true;
    }

};
