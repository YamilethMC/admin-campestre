import React, { useState, useEffect } from 'react';
import Modal from '../../../../shared/components/modal';
import { EventTypesOptions } from '../../interfaces';

const EventForm = ({ event, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    description: '',
    image: '',
    inscritedShow: true, // Changed from showInscribedCount
    progressShow: true, // Changed from showProgress
    date: '',
    totalSpots: 0,
    location: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imageChanged, setImageChanged] = useState(false); // Track if image has been changed
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
        image: event.image || '',
        inscritedShow: event.inscritedShow !== undefined ? event.inscritedShow : true,
        progressShow: event.progressShow !== undefined ? event.progressShow : true,
        date: formattedDate,
        totalSpots: event.totalSpots || 0,
        location: event.location || '',
      });
    } else {
      setFormData({
        type: '',
        name: '',
        description: '',
        image: '',
        inscritedShow: true,
        progressShow: true,
        date: '',
        totalSpots: 0,
        location: '',
      });
    }
  }, [event]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'totalSpots' ? parseInt(value) || 0 : value,
    }));

    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result, // This will be a base64 string
        }));
        setImageFile(file);
        setImageChanged(true); // Mark that image has been changed
      };
      reader.readAsDataURL(file);
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
    const local = new Date(dateLocalString); // Interpreta YYYY-MM-DDTHH:mm en tu zona local
    return new Date(local.getTime() - local.getTimezoneOffset() * 60000).toISOString();
  }

  const handleSaveConfirm = () => {
    // Prepare the data for submission
    let adjustedData = {
      ...formData,
      date: toUTC(formData.date),
    };

    // Only include image in adjustedData if it has been changed
    if (imageChanged && adjustedData.image) {
      // Validate image format if it has been changed
      if (!adjustedData.image.startsWith('data:image/')) {
        // If not in correct format, we may need to handle error or conversion
        // For now, we'll just pass it as is since handleImageChange already creates base64
      }
    } else {
      // Remove image from adjustedData if it hasn't been changed
      delete adjustedData.image;
    }

    onSave(adjustedData);
    // Reset imageChanged after successful save
    if (imageChanged) {
      setImageChanged(false);
    }
    setShowSaveModal(false);
  };

  const handleCancelConfirm = () => {
    setShowCancelModal(true);
  };

  const handleCancelAccept = () => {
    // Reset imageChanged when canceling
    if (imageChanged) {
      setImageChanged(false);
    }
    onCancel();
    setShowCancelModal(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={handleCancelConfirm} className="mr-4 text-gray-600 hover:text-gray-900">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
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

        {/* Image Upload - Full width */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
          <label
            htmlFor="image-upload"
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
          >
            <div className="space-y-1 text-center">
              {formData.image ? (
                <div className="mb-4">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="mx-auto max-h-40 object-contain rounded-md"
                  />
                </div>
              ) : (
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              <div>
                <span className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark">
                  <span>Seleccionar imagen</span>
                </span>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG hasta 10MB</p>
            </div>
            <input
              id="image-upload"
              name="image-upload"
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* Switches for showing inscribed count and progress */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Show Inscribed Count Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">Mostrar contador de inscritos</p>
                <p className="text-sm text-gray-500">Habilita el contador de personas inscritas</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData(prev => ({ ...prev, inscritedShow: !prev.inscritedShow }))
                }
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  formData.inscritedShow ? 'bg-primary' : 'bg-gray-200'
                }`}
                role="switch"
                aria-checked={formData.inscritedShow}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    formData.inscritedShow ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Show Progress Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">Mostrar progreso</p>
                <p className="text-sm text-gray-500">Habilita la barra de progreso del evento</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, progressShow: !prev.progressShow }))}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  formData.progressShow ? 'bg-primary' : 'bg-gray-200'
                }`}
                role="switch"
                aria-checked={formData.progressShow}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    formData.progressShow ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
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
            {EventTypesOptions.filter(opt => opt.value !== 'TODAS').map(option => (
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
      <Modal
        isOpen={showCancelModal}
        title="Confirmar salida"
        onClose={() => setShowCancelModal(false)}
        footer={
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowCancelModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleCancelAccept}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors"
            >
              Aceptar
            </button>
          </div>
        }
      >
        <p>¿Está seguro que quiere salir?</p>
      </Modal>

      {/* Save Confirmation Modal */}
      <Modal
        isOpen={showSaveModal}
        title="Confirmar guardado"
        onClose={() => setShowSaveModal(false)}
        footer={
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowSaveModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveConfirm}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors"
            >
              Aceptar
            </button>
          </div>
        }
      >
        <p>{event ? '¿Desea guardar los cambios?' : '¿Desea crear el evento?'}</p>
      </Modal>
    </div>
  );
};

export default EventForm;
