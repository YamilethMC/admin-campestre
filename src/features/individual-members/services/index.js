// Mock service for individual member operations
export const memberService = {
  // Get gender options (would come from API)
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
  
  // Add a new member
  addMember: async (memberData) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${process.env.REACT_APP_API_URL}/club-members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(memberData),
    });

    if (!response.ok) {
      const error = await response.json();
      let errorMessage = error.message || 'Error al registrar socio';

      // Manejar códigos de error específicos en el servicio
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
          errorMessage = error.message || 'Error al registrar socio';
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
      data: result,
      message: 'Socio registrado exitosamente',
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