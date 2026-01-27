import api from '../../../shared/api/api';

export const memberService = {
  getGenderOptions: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { value: 'MASCULINO', label: 'Masculino' },
      { value: 'FEMENINO', label: 'Femenino' }
    ];
  },

  getTituloOptions: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { value: 'C', label: 'Ciudadano' },
      { value: 'DR', label: 'Doctor' },
      { value: 'MC', label: 'Maestro en Ciencias' },
      { value: 'LIC', label: 'Licenciado' },
      { value: 'ING', label: 'Ingeniero' },
      { value: 'ARQ', label: 'Arquitecto' },
    ];
  },

  getPaymentMethodOptions: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { value: 'PPD', label: 'PPD' },
    ];
  },
  
  addMember: async (memberData) => {
    const response = await api.post('/club-members', memberData);

    if (!response.ok) {
      let errorMessage = response.data?.message || 'Error al registrar socio';

      switch (response.status) {
        case 400:
          errorMessage = 'Solicitud incorrecta: Verifica los datos proporcionados';
          break;
        case 409:
          errorMessage = 'Conflicto: Ya existe un socio con ese correo';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = response.data?.message || 'Error al registrar socio';
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    return {
      success: true,
      data: response.data,
      message: 'Socio registrado exitosamente',
      status: response.status
    };
  },

  getMemberById: async (id) => {
    const response = await api.get(`/club-members/${id}`);

    if (!response.ok) {
      let errorMessage = "Error al obtener miembro";

      switch (response.status) {
        case 404:
          errorMessage = 'Miembro no encontrado';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = response.data?.message || "Error al obtener miembro";
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    return {
      success: true,
      data: response.data.data,
      status: response.status
    };
  },

  updateMember: async (id, memberData) => {
    const updatePayload = {
      email: memberData.email,
      name: memberData.name,
      lastName: memberData.lastName,
      address: memberData.address,
      phone: memberData.phone,
      birthDate: memberData.birthDate,
      gender: memberData.gender,
      RFC: memberData.RFC,
      title: memberData.title,
      profession: memberData.profession,
      paymentMethod: memberData.paymentMethod,
      dateOfAdmission: memberData.dateOfAdmission,
      memberCode: memberData.memberCode,
      ...(memberData.invitedById && { invitedById: memberData.invitedById }),
      ...(memberData.relationship && { relationship: memberData.relationship })
    };

    const response = await api.patch(`/users/${id}`, updatePayload);

    if (!response.ok) {
      let errorMessage = "Error al actualizar socio";

      switch (response.status) {
        case 404:
          errorMessage = 'Miembro no encontrado';
          break;
        case 409:
          errorMessage = 'Ya existe un miembro con ese correo';
          break;
        case 500:
          errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
          break;
        default:
          errorMessage = response.data?.message || "Error al actualizar socio";
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      };
    }

    return {
      success: true,
      data: response.data.data,
      message: 'Socio actualizado exitosamente',
      status: response.status
    };
  },


  // Validate member data
  validateMember: (memberData) => {
    const errors = [];

    // Required fields validation
    if (!memberData.numero_socio || memberData.numero_socio.toString().trim() === '') {
      errors.push('El número de socio es obligatorio');
    }

    if (!memberData.nombre || memberData.nombre.trim() === '') {
      errors.push('El nombre es obligatorio');
    }

    // Email format validation
    if (memberData.email && memberData.email.trim() !== '') {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(memberData.email)) {
        errors.push('Formato de email inválido');
      }
    }

    // Number format validation
    if (memberData.numero_socio && isNaN(parseInt(memberData.numero_socio))) {
      errors.push('Número de socio debe ser un valor numérico');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};