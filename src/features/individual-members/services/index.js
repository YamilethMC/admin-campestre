// Mock service for individual member operations
export const memberService = {
  // Add a new member
  addMember: async (memberData) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create a mock response
    const mockResponse = {
      ...memberData,
      id: Date.now(), // In a real app, this would come from the server
      numero_socio: parseInt(memberData.numero_socio) // Ensure it's a number
    };
    
    // In a real app, this would make an actual API call
    console.log('Adding member:', mockResponse);
    
    return mockResponse;
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