import React, { useState, useEffect } from 'react';
import Modal from '../../../../shared/components/modal';
import { formStyles } from './Style';

const NoticeForm = ({ notice = null, onSave, onCancel }) => {
  const isEdit = !!notice;

  const formatDateForInput = (isoString) => {
     return isoString?.slice(0, 10) || "";
  };

  // Original data to compare for changes
  const [originalData, setOriginalData] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    title: notice?.title || '',
    message: notice?.message || '',
    image: notice?.image || '', // Add image field
    active: notice ? notice.active : true,
    visibleUntil: notice ? formatDateForInput(notice.visibleUntil) : '',
    type: notice?.type || '',
  });

  const [errors, setErrors] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSaveConfirmationModal, setShowSaveConfirmationModal] = useState(false);
  const [pendingNavigationCallback, setPendingNavigationCallback] = useState(null);
  const [pendingNavigationAction, setPendingNavigationAction] = useState(null);
  const [pendingSaveData, setPendingSaveData] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(!notice); // Track if creating new notice
  
  // Set original data when component mounts
  useEffect(() => {
    if (notice) {
      // For edit mode
      setOriginalData({
        title: notice.title,
        message: notice.message,
        image: notice.image || '',
        active: notice.active,
        visibleUntil: notice ? formatDateForInput(notice.visibleUntil) : '',
        type: notice.type,
      });
    } else {
      // For create mode - set original data to default values
      setOriginalData({
        title: '',
        message: '',
        image: '',
        active: true,
        visibleUntil: '',
        type: '',
      });
    }
  }, [notice]);
  
  // Check for changes
  useEffect(() => {
    if (originalData) {
      const isChanged = 
        JSON.stringify(originalData) !== JSON.stringify(formData);
      // If it's a new notice (no initial notice data) and any field has been modified, 
      // or if it's an edit and fields have changed
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

    // Validate message (required)
    if (!formData.message.trim()) {
      newErrors.message = 'Descripción es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Prepare the data for submission
      const submitData = {
        ...formData,
      };
      setPendingSaveData(submitData);
      setPendingNavigationAction(isEdit ? 'update' : 'create'); // Track if it's an update or create action
      setShowSaveConfirmationModal(true);
    }
  };

  // Confirmation before navigating away if there are unsaved changes
  const confirmLeave = (callback, action) => {
    if (hasUnsavedChanges) {
      // If there are actual changes, show confirmation
      setPendingNavigationCallback(() => callback);
      setPendingNavigationAction(action);
      setShowConfirmationModal(true);
    } else {
      // Always show confirmation when navigating away, regardless of mode
      // This ensures users confirm whether they're creating or editing
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

  const handleConfirmSave = () => {
    if (validateForm()) {
      setShowSaveConfirmationModal(false);
      if (pendingSaveData) {
        onSave(pendingSaveData);
        setPendingSaveData(null);
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
    <div className={formStyles.container}>
      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className={formStyles.backButton}
          aria-label="Regresar"
        >
          <svg className={formStyles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className={formStyles.title}>
          {isEdit ? 'Editar aviso' : 'Crear nuevo aviso'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className={formStyles.form}>
        <div className={formStyles.formRow}>
          <div>
            <label className={formStyles.label}>Título del aviso <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                handleInputChange('title', e.target.value);
                // Clear error when user starts typing
                if (errors.title) {
                  setErrors(prev => ({ ...prev, title: '' }));
                }
              }}
              className={`${formStyles.input} ${errors.title ? 'border-red-500' : ''}`}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>





          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.active}
              onChange={(e) => handleInputChange('active', e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              ¿Aviso activo?
            </label>
          </div>

          <div className="col-span-2">
            <label className={formStyles.label}>Descripción <span className="text-red-500">*</span></label>
            <textarea
              value={formData.message}
              onChange={(e) => {
                handleInputChange('message', e.target.value);
                // Clear error when user starts typing
                if (errors.message) {
                  setErrors(prev => ({ ...prev, message: '' }));
                }
              }}
              rows="4"
              className={`${formStyles.textarea} ${errors.message ? 'border-red-500' : ''}`}
            ></textarea>
            {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
          </div>

          {/* Image Upload - Full width */}
          <div className="col-span-2">
            <label className={formStyles.label}>Imagen</label>
            <label
              htmlFor="notice-image-upload"
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
            >
              <div className="space-y-1 text-center w-full">
                {formData.image ? (
                  <div className="mb-4">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="mx-auto max-h-40 object-contain rounded-md"
                    />
                  </div>
                ) : (
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                id="notice-image-upload"
                name="notice-image-upload"
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <div>
            <label className={formStyles.label}>Tipo de notificación</label>
            <input
              type="text"
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className={formStyles.input}
            />
          </div>

          <div>
            <label className={formStyles.label}>Visible hasta</label>
            <input
              type="date"
              value={formData.visibleUntil}
              onChange={(e) => handleInputChange('visibleUntil', e.target.value)}
              className={formStyles.input}
            />
          </div>


        </div>

        <div className={formStyles.buttonRow}>
          <button
            type="button"
            onClick={handleCancel}
            className={formStyles.cancelButton}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={formStyles.saveButton}
          >
            {isEdit ? 'Guardar cambios' : 'Crear aviso'}
          </button>
        </div>
      </form>
      
      <Modal
        isOpen={showConfirmationModal}
        title="Confirmar salida"
        onClose={handleCancelLeave}
        footer={
          <div className={formStyles.modalFooter}>
            <button
              type="button"
              onClick={handleCancelLeave}
              className={formStyles.modalCancelButton}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmLeave}
              className={formStyles.modalAcceptButton}
            >
              Aceptar
            </button>
          </div>
        }
      >
        <p>¿Está seguro que quiere {pendingNavigationAction === 'back' ? 'regresar' : 'cancelar'}? Los cambios no guardados se perderán.</p>
      </Modal>
      
      <Modal
        isOpen={showSaveConfirmationModal}
        title={isEdit ? 'Confirmar actualización' : 'Confirmar creación'}
        onClose={handleCancelSave}
        footer={
          <div className={formStyles.modalFooter}>
            <button
              type="button"
              onClick={handleCancelSave}
              className={formStyles.modalCancelButton}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmSave}
              className={formStyles.modalAcceptButton}
            >
              Aceptar
            </button>
          </div>
        }
      >
        <p>{pendingNavigationAction === 'create' ? '¿Desea crear el aviso?' : '¿Desea guardar los cambios?'}</p>
      </Modal>
    </div>
  );
};

export default NoticeForm;