import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../../shared/context/AppContext';
import { memberService } from '../services';

export const useIndividualMember = () => {
  const { members, setMembers, addLog, addToast } = useContext(AppContext);
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    sexo: '',
    rfc: '',
    fecha_nacimiento: '',
    email: '',
    telefono_movil: '',
    alias_movil: '',
    telefono_fijo: '',
    alias_fijo: '',
    telefono_emergencia: '',
    alias_emergencia: '',
    foraneo: false,
    calle: '',
    numero_exterior: '',
    numero_interior: '',
    codigo_postal: '',
    colonia: '',
    ciudad: '',
    estado: '',
    pais: '',
    titulo: '',
    profesion: '',
    metodo_pago: '',
    fecha_admision: '',
  });
  
  const [genderOptions, setGenderOptions] = useState([]);
  const [loadingGender, setLoadingGender] = useState(false);

  const [tituloOptions, setTituloOptions] = useState([]);
  const [loadingTitulo, setLoadingTitulo] = useState(false);

  const [paymentMethodOptions, setPaymentMethodOptions] = useState([]);
  const [loadingPaymentMethod, setLoadingPaymentMethod] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === "telefono_movil" || name === "telefono_fijo" || name === "telefono_emergencia" || name === "codigo_postal" || name === "numero_exterior" || name === "numero_interior") {
      // Permite solo dígitos y corta a 10
      const soloNumeros = value.replace(/\D/g, "").slice(0, 10);

      setFormData({
        ...formData,
        [name]: soloNumeros,
      });
    }

    if(name === "fecha_nacimiento") {
      const fechaActual = formattedDate();

      if(value >= fechaActual) {
        addLog('Error: La fecha de nacimiento no puede ser futura');
        addToast('Error: La fecha de nacimiento no puede ser futura', 'error');
        setFormData(prev => ({
          ...prev,
          fecha_nacimiento: '',
        }));
      }
    }
  };

  const formattedDate = () => {
    const fechaActual = new Date();
    const year = fechaActual.getFullYear();
    const month = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const day = String(fechaActual.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación de campos requeridos
      if (!validateFormData()) {
        return;
      }

    const newMember = {
      ...formData,
      id: members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1,
      numero_socio: members.length + 1, // Asegurar que sea número
      fecha_nacimiento: formData.fecha_nacimiento ? new Date(formData.fecha_nacimiento).toISOString().split('T')[0] : null, // YYYY-MM-DD format
      fecha_admision: formData.fecha_admision ? new Date(formData.fecha_admision).toISOString().split('T')[0] : null  // YYYY-MM-DD format
    };
    
    setMembers(prev => [...prev, newMember]);
    addLog(`Socio agregado: ${newMember.nombre} ${newMember.apellidos} (N° ${newMember.numero_socio})`);
    addToast(`Socio agregado: ${newMember.nombre} ${newMember.apellidos} (N° ${newMember.numero_socio})`, 'success');
    
    // Resetear formulario
    setFormData({
      nombre: '',
      apellidos: '',
      sexo: '',
      rfc: '',
      fecha_nacimiento: '',
      email: '',
      telefono_movil: '',
      alias_movil: '',
      telefono_fijo: '',
      alias_fijo: '',
      telefono_emergencia: '',
      alias_emergencia: '',
      foraneo: false,
      calle: '',
      numero_exterior: '',
      numero_interior: '',
      codigo_postal: '',
      colonia: '',
      ciudad: '',
      estado: '',
      pais: '',
      titulo: '',
      profesion: '',
      metodo_pago: '',
      fecha_admision: '',
    });
  };

  const validateFormData = () => {
    // Aquí puedes agregar validaciones adicionales si es necesario
    if (!formData.nombre) {
      addLog('Error: El nombre es obligatorio');
      addToast('Error: El nombre es obligatorio', 'error');
      return false;
    }

    if (!formData.apellidos) {
      addLog('Error: El apellido es obligatorio');
      addToast('Error: El apellido es obligatorio', 'error');
      return false;
    }

    if (!formData.sexo) {
      addLog('Error: El sexo es obligatorio');
      addToast('Error: El sexo es obligatorio', 'error');
      return false;
    }

    if (!formData.rfc) {
      addLog('Error: El RFC es obligatorio');
      addToast('Error: El RFC es obligatorio', 'error');
      return false;
    }

    if (!formData.fecha_nacimiento) {
      addLog('Error: La fecha de nacimiento es obligatoria');
      addToast('Error: La fecha de nacimiento es obligatoria', 'error');
      return false;
    }

    if (!formData.email) {
      addLog('Error: El email es obligatorio');
      addToast('Error: El email es obligatorio', 'error');
      return false;
    }

    if (!formData.telefono_movil) {
      addLog('Error: El teléfono móvil es obligatorio');
      addToast('Error: El teléfono móvil es obligatorio', 'error');
      return false;
    }

    if (!formData.calle) {
      addLog('Error: La calle es obligatoria');
      addToast('Error: La calle es obligatoria', 'error');
      return false;
    }

    if (!formData.numero_exterior) {
      addLog('Error: El número exterior es obligatorio');
      addToast('Error: El número exterior es obligatorio', 'error');
      return false;
    }

    if (!formData.codigo_postal) {
      addLog('Error: El código postal es obligatorio');
      addToast('Error: El código postal es obligatorio', 'error');
      return false;
    }

    if (!formData.colonia) {
      addLog('Error: La colonia es obligatoria');
      addToast('Error: La colonia es obligatoria', 'error');
      return false;
    }

    if (!formData.ciudad) {
      addLog('Error: La ciudad es obligatoria');
      addToast('Error: La ciudad es obligatoria', 'error');
      return false;
    }

    if (!formData.estado) {
      addLog('Error: El estado es obligatorio');
      addToast('Error: El estado es obligatorio', 'error');
      return false;
    }

    if (!formData.pais) {
      addLog('Error: El país es obligatorio');
      addToast('Error: El país es obligatorio', 'error');
      return false;
    }

    if (!formData.titulo) {
      addLog('Error: El título es obligatorio');
      addToast('Error: El título es obligatorio', 'error');
      return false;
    }

    if (!formData.metodo_pago) {
      addLog('Error: El método de pago es obligatorio');
      addToast('Error: El método de pago es obligatorio', 'error');
      return false;
    }

    if (!formData.fecha_admision) {
      addLog('Error: La fecha de admisión es obligatoria');
      addToast('Error: La fecha de admisión es obligatoria', 'error');
      return false;
    }
    
    // Validar formato de email si se proporciona
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      addLog('Error: Email inválido');
      addToast('Error: Email inválido', 'error');
      return false;
    }

    // Validar que los teléfonos contengan solo 10 dígitos
    if (formData.telefono_movil && !/^\d{10}$/.test(formData.telefono_movil)) {
      addLog('Error: El teléfono móvil debe contener exactamente 10 dígitos numéricos');
      addToast('Error: El teléfono móvil debe contener exactamente 10 dígitos numéricos', 'error');
      return false;
    }

    if (formData.telefono_fijo && !/^\d{10}$/.test(formData.telefono_fijo)) {
      addLog('Error: El teléfono fijo debe contener exactamente 10 dígitos numéricos');
      addToast('Error: El teléfono fijo debe contener exactamente 10 dígitos numéricos', 'error');
      return false;
    }

    if (formData.telefono_emergencia && !/^\d{10}$/.test(formData.telefono_emergencia)) {
      addLog('Error: El teléfono de emergencia debe contener exactamente 10 dígitos numéricos');
      addToast('Error: El teléfono de emergencia debe contener exactamente 10 dígitos numéricos', 'error');
      return false;
    }

    return true;
  }

  // Load gender options on component mount
  useEffect(() => {
    const loadGenderOptions = async () => {
      try {
        setLoadingGender(true);
        const options = await memberService.getGenderOptions();
        setGenderOptions(options);
      } catch (error) {
        console.error('Error loading gender options:', error);
        addLog('Error al cargar las opciones de género');
        addToast('Error al cargar las opciones de género', 'error');
      } finally {
        setLoadingGender(false);
      }
    };

    const loadTituloOptions = async () => {
      try {
        setLoadingTitulo(true);
        const options = await memberService.getTituloOptions();
        setTituloOptions(options);
      } catch (error) {
        console.error('Error loading titulo options:', error);
        addLog('Error al cargar las opciones de titulo');
        addToast('Error al cargar las opciones de titulo', 'error');
      } finally {
        setLoadingTitulo(false);
      }
    };

    const loadPaymentMethodOptions = async () => {
      try {
        setLoadingPaymentMethod(true);
        const options = await memberService.getPaymentMethodOptions();
        setPaymentMethodOptions(options);
      } catch (error) {
        console.error('Error loading payment method options:', error);
        addLog('Error al cargar las opciones de método de pago');
        addToast('Error al cargar las opciones de método de pago', 'error');
      } finally {
        setLoadingPaymentMethod(false);
      }
    };

    loadGenderOptions();
    loadTituloOptions();
    loadPaymentMethodOptions();
  }, [addLog, addToast]);

  return {
    members,
    addLog,
    addToast,
    formData,
    genderOptions,
    loadingGender,
    tituloOptions,
    loadingTitulo,
    paymentMethodOptions,
    loadingPaymentMethod,
    handleChange,
    handleSubmit
  };
}