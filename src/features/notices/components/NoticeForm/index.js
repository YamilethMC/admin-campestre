import React, { useState, useEffect } from 'react';
import Modal from '../../../../shared/components/modal';
import { formStyles } from './Style';

const NoticeForm = ({ notice = null, onSave, onCancel }) => {
  const isEdit = !!notice;
  
  // Original data to compare for changes
  const [originalData, setOriginalData] = useState(null);
  
  const [formData, setFormData] = useState({
    title: notice?.title || '',
    description: notice?.description || '',
    isActive: notice ? notice.isActive : true,
  });
  
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
        description: notice.description,
        isActive: notice.isActive,
      });
    } else {
      // For create mode - set original data to default values
      setOriginalData({
        title: '',
        description: '',
        isActive: true,
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



  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare the data for submission
    const submitData = {
      ...formData,
    };
    setPendingSaveData(submitData);
    setPendingNavigationAction(isEdit ? 'update' : 'create'); // Track if it's an update or create action
    setShowSaveConfirmationModal(true);
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
    setShowSaveConfirmationModal(false);
    if (pendingSaveData) {
      onSave(pendingSaveData);
      setPendingSaveData(null);
    }
    setPendingNavigationAction(null);
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
            <label className={formStyles.label}>Título del aviso</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={formStyles.input}
              required
            />
          </div>





          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              ¿Aviso activo?
            </label>
          </div>

          <div className="col-span-2">
            <label className={formStyles.label}>Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows="4"
              className={formStyles.textarea}
              required
            ></textarea>
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