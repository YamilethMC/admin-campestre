import { useState, useContext } from 'react';
import { AppContext } from '../../../shared/context/AppContext';

export const useIndividualMember = () => {
  const { members, setMembers, addLog, addToast } = useContext(AppContext);
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    rfc: '',
    fecha_nacimiento: '',
    email: '',
    telefono: '',
    foraneo: false,
    calle: '',
    numero_exterior: '',
    numero_interior: '',
    codigo_postal: '',
    colonia: '',
    ciudad: '',
    estado: '',
    pais: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación de campos requeridos
    if (!formData.nombre) {
      addLog('Error: El nombre es obligatorio');
      addToast('Error: El nombre es obligatorio', 'error');
      return;
    }

    if (!formData.apellidos) {
      addLog('Error: El apellido es obligatorio');
      addToast('Error: El apellido es obligatorio', 'error');
      return;
    }

    if (!formData.email) {
      addLog('Error: El email es obligatorio');
      addToast('Error: El email es obligatorio', 'error');
      return;
    }

    // Validar formato de email si se proporciona
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      addLog('Error: Email inválido');
      addToast('Error: Email inválido', 'error');
      return;
    }

    const newMember = {
      ...formData,
      id: members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1,
      numero_socio: members.length + 1 // Asegurar que sea número
    };
    
    setMembers(prev => [...prev, newMember]);
    addLog(`Socio agregado: ${newMember.nombre} ${newMember.apellidos} (N° ${newMember.numero_socio})`);
    addToast(`Socio agregado: ${newMember.nombre} ${newMember.apellidos} (N° ${newMember.numero_socio})`, 'success');
    
    // Resetear formulario
    setFormData({
      nombre: '',
      apellidos: '',
      rfc: '',
      fecha_nacimiento: '',
      email: '',
      telefono: '',
      foraneo: false,
      calle: '',
      numero_exterior: '',
      numero_interior: '',
      codigo_postal: '',
      colonia: '',
      ciudad: '',
      estado: '',
      pais: '',
    });
  };

  return {
    members,
    addLog,
    addToast,
    formData,
    handleChange,
    handleSubmit
  };
}