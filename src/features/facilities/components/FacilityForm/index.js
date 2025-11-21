import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../../../shared/context/AppContext';

const FacilityForm = ({ facility, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    status: 'ACTIVE',
    openTime: '08:00:00',
    closeTime: '22:00:00',
    maxDuration: 60
  });

  const [errors, setErrors] = useState({});
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const { toasts, setToasts } = useContext(AppContext);

  // Fill form data when facility prop changes (for editing)
  useEffect(() => {
    if (facility) {
      setFormData({
        name: facility.name || '',
        type: facility.type || '',
        description: facility.description || '',
        status: facility.status || 'ACTIVE',
        openTime: facility.openTime ? (facility.openTime.length > 8 ? facility.openTime.substring(11, 19) : facility.openTime) : '08:00:00',
        closeTime: facility.closeTime ? (facility.closeTime.length > 8 ? facility.closeTime.substring(11, 19) : facility.closeTime) : '22:00:00',
        maxDuration: facility.maxDuration || 60
      });
    } else {
      // Reset form for new facility
      setFormData({
        name: '',
        type: '',
        description: '',
        status: 'ACTIVE',
        openTime: '08:00:00',
        closeTime: '22:00:00',
        maxDuration: 60
      });
      setErrors({});
    }
  }, [facility]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.type) {
      newErrors.type = 'El tipo es obligatorio';
    }

    if (!formData.status) {
      newErrors.status = 'El estado es obligatorio';
    }

    if (!formData.openTime) {
      newErrors.openTime = 'La hora de apertura es obligatoria';
    }

    if (!formData.closeTime) {
      newErrors.closeTime = 'La hora de cierre es obligatoria';
    }

    if (formData.openTime && formData.closeTime && formData.openTime >= formData.closeTime) {
      newErrors.closeTime = 'La hora de cierre debe ser mayor que la hora de apertura';
    }

    if (!formData.maxDuration || formData.maxDuration <= 0) {
      newErrors.maxDuration = 'La duración máxima debe ser mayor que 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    confirmAction('save');
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    try {
      // Format time strings to ISO format required by API
      const formattedData = {
        ...formData,
        openTime: `2023-01-01T${formData.openTime}Z`,
        closeTime: `2023-01-01T${formData.closeTime}Z`
      };

      await onSave(formattedData);
    } catch (error) {
      // Error is handled in the parent component
    } finally {
      setIsSaving(false);
    }
  };

  const confirmAction = (action, data = null) => {
    setModalAction({ action, data });
    setShowConfirmationModal(true);
  };

  const handleConfirm = () => {
    if (modalAction) {
      if (modalAction.action === 'back' || modalAction.action === 'cancel') {
        onCancel();
      } else if (modalAction.action === 'save') {
        handleConfirmSave();
      }
    }
    setShowConfirmationModal(false);
    setModalAction(null);
  };

  const handleCancel = () => {
    setShowConfirmationModal(false);
    setModalAction(null);
  };

  const handleBack = () => {
    confirmAction('back');
  };

  const typeOptions = [
    { value: 'PADEL', label: 'Padel' },
    { value: 'TENNIS', label: 'Tennis' },
    { value: 'GYM', label: 'Gimnasio' },
    { value: 'OTHER', label: 'Otro' }
  ];

  const statusOptions = [
    { value: 'ACTIVE', label: 'Activo' },
    { value: 'INACTIVE', label: 'Inactivo' },
    { value: 'MAINTENANCE', label: 'En mantenimiento' }
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-900 mr-4"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            {facility ? 'Editar instalación' : 'Agregar instalación'}
          </h2>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nombre de la instalación"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.type ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Seleccione un tipo</option>
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.status ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Descripción de la instalación (opcional)"
            />
          </div>

          {/* Time fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Open Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora de apertura *
              </label>
              <input
                type="time"
                name="openTime"
                value={formData.openTime}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.openTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.openTime && <p className="mt-1 text-sm text-red-600">{errors.openTime}</p>}
            </div>

            {/* Close Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora de cierre *
              </label>
              <input
                type="time"
                name="closeTime"
                value={formData.closeTime}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.closeTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.closeTime && <p className="mt-1 text-sm text-red-600">{errors.closeTime}</p>}
            </div>
          </div>

          {/* Max Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duración máxima (minutos) *
            </label>
            <input
              type="number"
              name="maxDuration"
              value={formData.maxDuration}
              onChange={handleChange}
              min="1"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.maxDuration ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Duración máxima en minutos"
            />
            {errors.maxDuration && <p className="mt-1 text-sm text-red-600">{errors.maxDuration}</p>}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-8">
          <button
            type="button"
            onClick={() => confirmAction('cancel')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none disabled:opacity-50"
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmar acción</h3>
            <p className="text-gray-600 mb-4">
              {modalAction?.action === 'save'
                ? '¿Estás seguro que deseas guardar los cambios?'
                : `¿Estás seguro que deseas ${modalAction?.action === 'back' ? 'regresar' : 'cancelar'}?`}
              {modalAction?.action !== 'save' && ' Los cambios no guardados se perderán.'}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                onClick={handleCancel}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                onClick={handleConfirm}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilityForm;