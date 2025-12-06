import React, { useState, useEffect } from 'react';
import Modal from '../../../../shared/components/modal';

const BannerForm = ({ banner = null, onSave, onCancel }) => {
  const isEdit = !!banner;

  const formatDateForInput = (isoString) => {
    return isoString?.slice(0, 10) || "";
  };

  const [originalData, setOriginalData] = useState(null);

  // Define action types
  const actionTypes = [
    { id: 1, name: "Enlace externo", description: "Abrir página en navegación móvil" },
    { id: 2, name: "Enlace interno", description: "Abrir página en aplicación" },
    { id: 3, name: "Abrir modal", description: "Mostrar modal con información, formulario u otro contenido" },
    { id: 4, name: "Abrir documento", description: "Abrir documento con URL de almacenamiento" },
    { id: 5, name: "Compartir", description: "Compartir banner en redes sociales" }
  ];

  const [formData, setFormData] = useState({
    title: banner?.title || '',
    description: banner?.description || '',
    image: banner?.image || '',
    active: banner ? banner.active : true,
    startDate: banner ? formatDateForInput(banner.startDate) : '',
    endDate: banner ? formatDateForInput(banner.endDate) : '',
    typeActionId: banner?.typeActionId || 1
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSaveConfirmationModal, setShowSaveConfirmationModal] = useState(false);
  const [pendingNavigationCallback, setPendingNavigationCallback] = useState(null);
  const [pendingNavigationAction, setPendingNavigationAction] = useState(null);
  const [pendingSaveData, setPendingSaveData] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(!banner);

  // Set original data when component mounts
  useEffect(() => {
    if (banner) {
      // For edit mode
      setOriginalData({
        title: banner.title,
        description: banner.description,
        image: banner.image,
        active: banner.active,
        startDate: banner ? formatDateForInput(banner.startDate) : '',
        endDate: banner ? formatDateForInput(banner.endDate) : '',
        typeActionId: banner.typeActionId
      });
    } else {
      // For create mode - set original data to default values
      setOriginalData({
        title: '',
        description: '',
        image: '',
        active: true,
        startDate: '',
        endDate: '',
        typeActionId: 1
      });
    }
  }, [banner]);

  // Check for changes
  useEffect(() => {
    if (originalData) {
      const isChanged =
        JSON.stringify(originalData) !== JSON.stringify(formData);
      setHasUnsavedChanges(isChanged);
    }
  }, [formData, originalData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result // This will be a base64 string
        }));
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate title (required)
    if (!formData.title.trim()) {
      newErrors.title = 'Título es requerido';
    }

    // Validate typeActionId (required)
    if (!formData.typeActionId) {
      newErrors.typeActionId = 'Tipo de acción es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Prepare the data for submission - dates should already be in correct format
      const submitData = {
        ...formData
      };
      setPendingSaveData(submitData);
      setPendingNavigationAction(isEdit ? 'update' : 'create');
      setShowSaveConfirmationModal(true);
    }
  };

  // Confirmation before navigating away if there are unsaved changes
  const confirmLeave = (callback, action) => {
    if (hasUnsavedChanges) {
      setPendingNavigationCallback(() => callback);
      setPendingNavigationAction(action);
      setShowConfirmationModal(true);
    } else {
      // Always show confirmation when navigating away, regardless of mode
      setPendingNavigationCallback(() => callback);
      setPendingNavigationAction(action);
      setShowConfirmationModal(true);
    }
  };

  const handleCancel = () => {
    confirmLeave(onCancel, 'cancel');
  };

  const handleBack = () => {
    confirmLeave(onCancel, 'back');
  };

  const handleConfirmLeave = () => {
    setShowConfirmationModal(false);
    if (pendingNavigationCallback) {
      pendingNavigationCallback();
      setPendingNavigationCallback(null);
    }
    setPendingNavigationAction(null);
  };

  const handleCancelLeave = () => {
    setShowConfirmationModal(false);
    setPendingNavigationCallback(null);
    setPendingNavigationAction(null);
  };

  const handleConfirmSave = async () => {
    if (validateForm()) {
      setShowSaveConfirmationModal(false);
      if (pendingSaveData) {
        try {
          await onSave(pendingSaveData);
          setPendingSaveData(null);
        } catch (error) {
          // Stay on the form if there's an error
          console.error('Save failed:', error);
        }
      }
      setPendingNavigationAction(null);
    }
  };

  const handleCancelSave = () => {
    setShowSaveConfirmationModal(false);
    setPendingSaveData(null);
    setPendingNavigationAction(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors mr-3"
          aria-label="Regresar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold text-gray-800">
          {isEdit ? 'Editar banner' : 'Crear nuevo banner'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-medium text-gray-500 mb-4 uppercase tracking-wide">Información básica</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título del banner <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  handleInputChange('title', e.target.value);
                  if (errors.title) {
                    setErrors(prev => ({ ...prev, title: '' }));
                  }
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div className="flex items-center pt-6">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.active}
                onChange={(e) => handleInputChange('active', e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                ¿Banner activo?
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Media Section */}
        <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-medium text-gray-500 mb-4 uppercase tracking-wide">Media</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagen
            </label>
            <div
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-primary transition-colors"
              onClick={() => document.getElementById('image-upload').click()}
            >
              <div className="space-y-1 text-center w-full">
                {formData.image ? (
                  <div className="mb-4">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="mx-auto max-h-40 max-w-full object-contain rounded-md"
                    />
                  </div>
                ) : (
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-primary hover:text-primary-dark cursor-pointer">
                      Click para subir
                    </span>
                  </p>
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
              </div>
            </div>
          </div>
        </div>

        {/* Dates and Actions Section */}
        <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-medium text-gray-500 mb-4 uppercase tracking-wide">Fechas y acciones</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de inicio
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de fin
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de acción <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.typeActionId}
                onChange={(e) => {
                  handleInputChange('typeActionId', parseInt(e.target.value));
                  if (errors.typeActionId) {
                    setErrors(prev => ({ ...prev, typeActionId: '' }));
                  }
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.typeActionId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {actionTypes.map(action => (
                  <option key={action.id} value={action.id}>
                    {action.name}
                  </option>
                ))}
              </select>
              {errors.typeActionId && <p className="mt-1 text-sm text-red-600">{errors.typeActionId}</p>}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors"
          >
            {isEdit ? 'Guardar cambios' : 'Crear banner'}
          </button>
        </div>
      </form>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showConfirmationModal}
        title="Confirmar salida"
        onClose={handleCancelLeave}
        footer={
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancelLeave}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmLeave}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors"
            >
              Aceptar
            </button>
          </div>
        }
      >
        <p>¿Está seguro que quiere {pendingNavigationAction === 'back' ? 'regresar' : 'cancelar'}? Los cambios no guardados se perderán.</p>
      </Modal>

      {/* Save Confirmation Modal */}
      <Modal
        isOpen={showSaveConfirmationModal}
        title={isEdit ? 'Confirmar actualización' : 'Confirmar creación'}
        onClose={handleCancelSave}
        footer={
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancelSave}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmSave}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors"
            >
              Aceptar
            </button>
          </div>
        }
      >
        <p>{isEdit ? '¿Desea guardar los cambios?' : '¿Desea crear el banner?'}</p>
      </Modal>
    </div>
  );
};

export default BannerForm;