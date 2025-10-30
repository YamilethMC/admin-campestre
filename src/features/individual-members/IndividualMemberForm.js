import React, { useState, useContext } from 'react';
import { AppContext } from '../../shared/context/AppContext';

const IndividualMemberForm = () => {
  const { members, setMembers, addLog, addToast } = useContext(AppContext);
  
  const [formData, setFormData] = useState({
    numero_socio: '',
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    foraneo: false,
    direccion: '',
    id_sistema_entradas: ''
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
    if (!formData.numero_socio || !formData.nombre) {
      addLog('Error: El número de socio y nombre son obligatorios');
      addToast('Error: El número de socio y nombre son obligatorios', 'error');
      return;
    }

    // Validar formato de email si se proporciona
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      addLog('Error: Email inválido');
      addToast('Error: Email inválido', 'error');
      return;
    }

    // Validar que el número de socio no exista ya
    const existingMember = members.find(m => m.numero_socio == parseInt(formData.numero_socio));
    if (existingMember) {
      addLog(`Error: Ya existe un socio con el número ${formData.numero_socio}`);
      addToast(`Error: Ya existe un socio con el número ${formData.numero_socio}`, 'error');
      return;
    }

    const newMember = {
      ...formData,
      id: members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1,
      numero_socio: parseInt(formData.numero_socio) // Asegurar que sea número
    };
    
    setMembers(prev => [...prev, newMember]);
    addLog(`Socio agregado: ${newMember.nombre} ${newMember.apellidos} (N° ${newMember.numero_socio})`);
    addToast(`Socio agregado: ${newMember.nombre} ${newMember.apellidos} (N° ${newMember.numero_socio})`, 'success');
    
    // Resetear formulario
    setFormData({
      numero_socio: '',
      nombre: '',
      apellidos: '',
      email: '',
      telefono: '',
      foraneo: false,
      direccion: '',
      id_sistema_entradas: ''
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-primary">Alta Individual de Socios</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de Socio *
          </label>
          <input
            type="number"
            name="numero_socio"
            value={formData.numero_socio}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apellidos
          </label>
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            name="foraneo"
            checked={formData.foraneo}
            onChange={handleChange}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            ¿Es foráneo?
          </label>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dirección
          </label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID Sistema Entradas
          </label>
          <input
            type="text"
            name="id_sistema_entradas"
            value={formData.id_sistema_entradas}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Agregar Socio
          </button>
        </div>
      </form>
    </div>
  );
};

export default IndividualMemberForm;