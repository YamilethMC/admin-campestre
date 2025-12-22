import React, { useState, useEffect } from 'react';
import Modal from '../../../../shared/components/modal';

const HelpCenterForm = ({ helpCenter = null, onSave, onCancel }) => {
  const isEdit = !!helpCenter;

  // Original data to compare for changes
  const [originalData, setOriginalData] = useState(null);

  const [formData, setFormData] = useState({
    question: helpCenter?.question || '',
    answer: helpCenter?.answer || '',
  });

  const [errors, setErrors] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSaveConfirmationModal, setShowSaveConfirmationModal] = useState(false);
  const [pendingNavigationCallback, setPendingNavigationCallback] = useState(null);
  const [pendingSaveData, setPendingSaveData] = useState(null);

  // Set original data when component mounts
  useEffect(() => {
    if (helpCenter) {
      // For edit mode
      setOriginalData({
        question: helpCenter.question,
        answer: helpCenter.answer,
      });
    } else {
      // For create mode
      setOriginalData({
        question: '',
        answer: '',
      });
    }
  }, [helpCenter]);

  // Check for changes
  useEffect(() => {
    if (originalData) {
      const isChanged = JSON.stringify(originalData) !== JSON.stringify(formData);
      setHasUnsavedChanges(isChanged);
    }
  }, [formData, originalData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (validateForm()) {
      // Prepare the data for submission
      const submitData = { ...formData };
      setPendingSaveData(submitData);
      setShowSaveConfirmationModal(true);
    }
  };

  // Confirmation before navigating away if there are unsaved changes
  const confirmLeave = callback => {
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

  const validateForm = () => {
    const newErrors = {};

    // Validate question (required)
    if (!formData.question.trim()) {
      newErrors.question = 'Pregunta es requerida';
    }

    // Validate answer (required)
    if (!formData.answer.trim()) {
      newErrors.answer = 'Respuesta es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmSave = () => {
    if (validateForm()) {
      setShowSaveConfirmationModal(false);
      if (pendingSaveData) {
        onSave(pendingSaveData);
        setPendingSaveData(null);
      }
    } else {
      // If validation fails, don't close the modal
      return;
    }
  };

  const handleCancelSave = () => {
    setShowSaveConfirmationModal(false);
    setPendingSaveData(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={handleCancel}
          className="mr-4 p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Regresar"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          {isEdit ? 'Editar pregunta' : 'Agregar pregunta'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pregunta <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.question}
            onChange={e => {
              handleInputChange('question', e.target.value);
              // Clear error when user starts typing
              if (errors.question) {
                setErrors(prev => ({ ...prev, question: '' }));
              }
            }}
            rows="3"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.question ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ingresa la pregunta..."
          />
          {errors.question && <p className="mt-1 text-sm text-red-600">{errors.question}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Respuesta <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.answer}
            onChange={e => {
              handleInputChange('answer', e.target.value);
              // Clear error when user starts typing
              if (errors.answer) {
                setErrors(prev => ({ ...prev, answer: '' }));
              }
            }}
            rows="5"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.answer ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ingresa la respuesta..."
          />
          {errors.answer && <p className="mt-1 text-sm text-red-600">{errors.answer}</p>}
        </div>

        <div className="flex justify-end space-x-3">
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
            {isEdit ? 'Guardar cambios' : 'Guardar'}
          </button>
        </div>
      </form>

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
        <p>¿Está seguro que quiere salir?</p>
      </Modal>

      <Modal
        isOpen={showSaveConfirmationModal}
        title="Confirmar guardado"
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
        <p>{isEdit ? '¿Desea guardar los cambios?' : '¿Desea guardar la pregunta?'}</p>
      </Modal>
    </div>
  );
};

export default HelpCenterForm;
