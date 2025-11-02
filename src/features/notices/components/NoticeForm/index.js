import React, { useState, useEffect } from 'react';
import { NoticeCategory, NoticePriority } from '../../interfaces';
import Modal from '../../../../shared/components/modal';
import { formStyles } from './Style';

const NoticeForm = ({ notice = null, onSave, onCancel }) => {
  const isEdit = !!notice;
  
  // Original data to compare for changes
  const [originalData, setOriginalData] = useState(null);
  
  const [formData, setFormData] = useState({
    title: notice?.title || '',
    description: notice?.description || '',
    category: notice?.category || NoticeCategory.GENERAL,
    priority: notice?.priority || NoticePriority.NORMAL,
    isActive: notice ? notice.isActive : true,
    imageUrl: notice?.imageUrl || '',
    imageFile: null, // For handling local file
  });
  
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSaveConfirmationModal, setShowSaveConfirmationModal] = useState(false);
  const [pendingNavigationCallback, setPendingNavigationCallback] = useState(null);
  const [pendingSaveData, setPendingSaveData] = useState(null);
  
  // Set original data when component mounts
  useEffect(() => {
    if (notice) {
      // For edit mode
      setOriginalData({
        title: notice.title,
        description: notice.description,
        category: notice.category,
        priority: notice.priority,
        isActive: notice.isActive,
        imageUrl: notice.imageUrl,
        imageFile: null, // No file selected initially when editing
      });
    } else {
      // For create mode
      setOriginalData({
        title: '',
        description: '',
        category: NoticeCategory.GENERAL,
        priority: NoticePriority.NORMAL,
        isActive: true,
        imageUrl: '',
        imageFile: null,
      });
    }
  }, [notice]);
  
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
      // Check if the file is an image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            imageFile: file, // Store the actual file
            imageUrl: reader.result // Store the data URL for preview
          }));
        };
        reader.readAsDataURL(file);
      } else {
        alert('Por favor selecciona un archivo de imagen válido (JPEG, PNG, etc.)');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare the data for submission
    const submitData = {
      ...formData,
      // If there's an image file, use its data URL; otherwise keep the existing imageUrl
      imageUrl: formData.imageFile ? formData.imageUrl : formData.imageUrl
    };
    setPendingSaveData(submitData);
    setShowSaveConfirmationModal(true);
  };

  // Confirmation before navigating away if there are unsaved changes
  const confirmLeave = (callback) => {
    if (hasUnsavedChanges) {
      setPendingNavigationCallback(() => callback);
      setShowConfirmationModal(true);
    } else {
      callback(); // No changes, allow navigation directly
    }
  };

  const handleCancel = () => {
    confirmLeave(onCancel);
  };

  const handleConfirmLeave = () => {
    setShowConfirmationModal(false);
    if (pendingNavigationCallback) {
      pendingNavigationCallback();
      setPendingNavigationCallback(null);
    }
  };

  const handleCancelLeave = () => {
    setShowConfirmationModal(false);
    setPendingNavigationCallback(null);
  };

  const handleConfirmSave = () => {
    setShowSaveConfirmationModal(false);
    if (pendingSaveData) {
      onSave(pendingSaveData);
      setPendingSaveData(null);
    }
  };

  const handleCancelSave = () => {
    setShowSaveConfirmationModal(false);
    setPendingSaveData(null);
  };

  return (
    <div className={formStyles.container}>
      <div className="flex items-center mb-6">
        <button
          onClick={handleCancel}
          className={formStyles.backButton}
          aria-label="Regresar"
        >
          <svg className={formStyles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className={formStyles.title}>
          {isEdit ? 'Editar Aviso' : 'Crear Nuevo Aviso'}
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

          <div>
            <label className={formStyles.label}>Categoría</label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={formStyles.select}
            >
              {Object.entries(NoticeCategory)
                .filter(([key]) => key !== 'ALL') // Exclude the 'ALL' category which is only for filtering
                .map(([key, value]) => (
                  <option key={key} value={value}>{value}</option>
                ))}
            </select>
          </div>

          <div>
            <label className={formStyles.label}>Prioridad</label>
            <select
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              className={formStyles.select}
            >
              {Object.entries(NoticePriority).map(([key, value]) => (
                <option key={key} value={value}>{value}</option>
              ))}
            </select>
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

          <div className="col-span-2">
            <label className={formStyles.label}>Imagen (opcional)</label>
            <div className={formStyles.imageContainer}>
              <div className={formStyles.imagePreview}>
                {formData.imageUrl ? (
                  <img 
                    src={formData.imageUrl} 
                    alt="Previsualización" 
                    className={formStyles.imagePreviewImg}
                  />
                ) : (
                  <svg className={formStyles.imageIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <label className={formStyles.imageButton}>
                Seleccionar imagen
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {formData.imageFile && (
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, imageFile: null, imageUrl: '' }))}
                  className={formStyles.deleteImageButton}
                >
                  Eliminar
                </button>
              )}
            </div>
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
            {isEdit ? 'Guardar Cambios' : 'Crear Aviso'}
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
        <p>¿Está seguro que quiere salir?</p>
      </Modal>
      
      <Modal
        isOpen={showSaveConfirmationModal}
        title="Confirmar guardado"
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
        <p>{isEdit ? '¿Desea guardar los cambios?' : '¿Desea crear el aviso?'}</p>
      </Modal>
    </div>
  );
};

export default NoticeForm;