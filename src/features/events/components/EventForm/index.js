import React, { useState, useEffect } from 'react';
import { EventTypesOptions } from '../../interfaces';

const EventForm = ({ event, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    description: '',
    date: '',
    totalSpots: 0,
    location: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  useEffect(() => {
    if (event) {
      let formattedDate = '';
      if (event.date) {
        const date = new Date(event.date);
        formattedDate = date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
      }

      setFormData({
        type: event.type || '',
        name: event.name || '',
        description: event.description || '',
        date: formattedDate,
        totalSpots: event.totalSpots || 0,
        location: event.location || ''
      });
    } else {
      setFormData({
        type: '',
        name: '',
        description: '',
        date: '',
        totalSpots: 0,
        location: ''
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalSpots' ? parseInt(value) || 0 : value
    }));
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.type) newErrors.type = 'Tipo de evento es requerido';
    if (!formData.name.trim()) newErrors.name = 'Nombre es requerido';
    if (!formData.description.trim()) newErrors.description = 'Descripción es requerida';
    if (!formData.date) newErrors.date = 'Fecha es requerida';
    if (formData.totalSpots <= 0) newErrors.totalSpots = 'Número de lugares debe ser mayor a 0';
    if (!formData.location.trim()) newErrors.location = 'Lugar es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveClick = () => {
    if (validateForm()) {
      setShowSaveModal(true);
    }
  };

  function toUTC(dateLocalString) {
    const local = new Date(dateLocalString);        // Interpreta YYYY-MM-DDTHH:mm en tu zona local
    return new Date(local.getTime() - local.getTimezoneOffset() * 60000).toISOString();
  }

  const handleSaveConfirm = () => {
    const adjustedData = {
    ...formData,
    date: toUTC(formData.date)
    };
    onSave(adjustedData);
    setShowSaveModal(false);
  };

  const handleCancelConfirm = () => {
    setShowCancelModal(true);
  };

  const handleCancelAccept = () => {
    onCancel();
    setShowCancelModal(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center mb-6">
        <button
          onClick={handleCancelConfirm}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {event ? 'Editar evento' : 'Crear nuevo evento'}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name - Full width */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nombre del evento"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Description - Full width */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Descripción del evento"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        {/* Type and Total Spots - Two per line */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de evento <span className="text-red-500">*</span>
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.type ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccionar tipo</option>
            {EventTypesOptions.filter(opt => opt.value !== 'TODAS').map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de lugares <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="totalSpots"
            value={formData.totalSpots}
            onChange={handleChange}
            min="1"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.totalSpots ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Número de lugares disponibles"
          />
          {errors.totalSpots && <p className="mt-1 text-sm text-red-600">{errors.totalSpots}</p>}
        </div>

        {/* Location and Date - Two per line */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lugar <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.location ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Lugar del evento"
          />
          {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={handleCancelConfirm}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSaveClick}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Guardar
        </button>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">¿Estás seguro?</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Si cancelas, perderás los cambios realizados. ¿Deseas continuar?
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 mr-2"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCancelAccept}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 ml-2"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Confirmation Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">¿Guardar cambios?</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  ¿Deseas guardar los cambios realizados en este evento?
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 mr-2"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveConfirm}
                  className="px-4 py-2 bg-primary text-white text-base font-medium rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary ml-2"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventForm;