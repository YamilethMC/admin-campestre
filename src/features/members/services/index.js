export const memberService = {
    async fetchMembers
    ({
        page = 1,
        limit = 10,
        orderBy = 'name',
        order = 'asc',
        active = true
    } = {}) {
        const token = localStorage.getItem("authToken");
        console.log('active', active)
        const response = await fetch(
            `${process.env.REACT_APP_API_URL}/club-members?page=${page}&limit=${limit}&orderBy=${orderBy}&order=${order}&active=${active}`,
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
        console.log('data', data)
        console.log('data.data', data.data)
        return data.data; // contiene members + meta
    }

};
