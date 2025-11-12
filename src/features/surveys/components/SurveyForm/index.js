import React, { useState, useEffect } from 'react';
import { SurveyCategory, SurveyPriority, SurveyQuestionType } from '../../interfaces';
import Modal from '../../../../shared/components/modal';
import { useSurvey } from '../../hooks/useSurvey';

const SurveyForm = ({ survey = null, onSave, onCancel }) => {
  const isEdit = !!survey;
  
  const { surveyCategoryOptions, surveyPriorityOptions, loadingSurveyCategory, loadingSurveyPriority } = useSurvey();
  // Original data to compare for changes
  const [originalData, setOriginalData] = useState(null);
  
  const [formData, setFormData] = useState({
    title: survey?.title || '',
    description: survey?.description || '',
    category: survey?.category || '',
    priority: survey?.priority || '',
    estimatedTime: survey?.timeStimed || '',
    imageUrl: survey?.imageUrl || '',
    imageFile: null, // For handling local file
    isActive: survey ? survey.active : true,
    questions: survey?.surveyQuestions && Array.isArray(survey.surveyQuestions) && survey.surveyQuestions.length > 0 
      ? survey.surveyQuestions.map(q => ({
        id: q.id,
        question: q.question,
        type: q.type,
        required: q.required,
        order: q.order,
        options: q.type === SurveyQuestionType.BOOLEAN && (!q.options || q.options.length === 0)
          ? ['Sí', 'No']
          : (q.options && Array.isArray(q.options))
            ? q.options.map(opt => opt.option) // Extract the option text from each option object
            : [''] // Ensure options array exists
      }))
      : [{ id: Date.now(), question: '', type: SurveyQuestionType.TEXT, options: [''], required:
      false }]
   })
          /*...q,
          options: q.type === SurveyQuestionType.YES_NO && (!q.options || q.options.length === 0) 
            ? ['Sí', 'No'] 
            : q.options || [''] // Ensure options array exists
        }))
      : [{ id: Date.now(), question: '', type: SurveyQuestionType.TEXT, options: [''], required: false }]
  });*/
  
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSaveConfirmationModal, setShowSaveConfirmationModal] = useState(false);
  const [pendingNavigationCallback, setPendingNavigationCallback] = useState(null);
  const [pendingSaveData, setPendingSaveData] = useState(null);
  
  // Set original data when component mounts
  useEffect(() => {
    if (survey) {
      // For edit mode
      setOriginalData({
        title: survey.title,
        description: survey.description,
        category: survey.category,
        priority: survey.priority,
        estimatedTime: survey.timeStimed,
        imageUrl: survey.imageUrl,
        imageFile: null, // No file selected initially when editing
        isActive: survey.active,
        questions: survey.surveyQuestions 
          ? survey.surveyQuestions.map(q => ({ ...q }))
          : [{ id: Date.now(), question: '', type: SurveyQuestionType.TEXT, options: [''], required: false }]
      });
    } else {
      // For create mode
      setOriginalData({
        title: '',
        description: '',
        category: SurveyCategory.SERVICES,
        priority: SurveyPriority.NORMAL,
        estimatedTime: '',
        imageUrl: '',
        imageFile: null,
        isActive: true,
        questions: [{ id: Date.now(), question: '', type: SurveyQuestionType.TEXT, options: [''], required: false }]
      });
    }
  }, [survey]);
  
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

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    let updatedQuestion = {
      ...updatedQuestions[index],
      [field]: value
    };
    
    // If the question type is changed to 'yes-no', automatically add 'Sí' and 'No' options
    if (field === 'type' && value === SurveyQuestionType.BOOLEAN) {
      updatedQuestion.options = ['Sí', 'No'];
    } else if (field === 'type' && updatedQuestion.type === SurveyQuestionType.BOOLEAN && value !== SurveyQuestionType.BOOLEAN) {
      // If changing from 'yes-no' to another type, reset options to default
      updatedQuestion.options = [''];
    }
    
    updatedQuestions[index] = updatedQuestion;
    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...formData.questions];
    const updatedOptions = [...updatedQuestions[questionIndex].options];
    updatedOptions[optionIndex] = value;
    updatedQuestions[questionIndex].options = updatedOptions;
    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options = [...updatedQuestions[questionIndex].options, ''];
    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...formData.questions];
    if (updatedQuestions[questionIndex].options.length > 2) { // Ensure at least 2 options
      const updatedOptions = [...updatedQuestions[questionIndex].options];
      updatedOptions.splice(optionIndex, 1);
      updatedQuestions[questionIndex].options = updatedOptions;
      setFormData(prev => ({
        ...prev,
        questions: updatedQuestions
      }));
    }
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { 
          id: Date.now(), 
          question: '', 
          type: SurveyQuestionType.TEXT, 
          options: [''], 
          required: false 
        }
      ]
    }));
  };

  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      const updatedQuestions = [...formData.questions];
      updatedQuestions.splice(index, 1);
      setFormData(prev => ({
        ...prev,
        questions: updatedQuestions
      }));
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

  const getQuestionTypeName = (type) => {
    switch (type) {
      case SurveyQuestionType.NUMBER:
        return 'Rango (1-10)';
      case SurveyQuestionType.SELECT:
        return 'Opción múltiple';
      case SurveyQuestionType.TEXT:
        return 'Abierta';
      case SurveyQuestionType.BOOLEAN:
        return 'Sí/No';
      default:
        return 'Abierta';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={handleCancel}
          className="mr-4 p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Regresar"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          {isEdit ? 'Editar encuesta' : 'Crear nueva encuesta'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la encuesta</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo estimado</label>
            <input
              type="text"
              value={formData.estimatedTime}
              onChange={(e) => handleInputChange('estimatedTime', e.target.value)}
              placeholder="ej. 3-5 min"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Seleccione una opción...</option>
              {surveyCategoryOptions
                .filter((option) => option.value !== 'TODAS') // ⬅️ aquí tu filtro
                .map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))
              }
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
            <select
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Seleccione una opción...</option>
              {surveyPriorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagen (opcional)</label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-16 h-16 border border-gray-300 rounded-md overflow-hidden bg-gray-100">
                {formData.imageUrl ? (
                  <img 
                    src={formData.imageUrl} 
                    alt="Previsualización" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <label className="cursor-pointer bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors">
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
                  className="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Preguntas</h3>

          {formData.questions.map((question, index) => (
            <div key={question.id} className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-700">Pregunta {index + 1}</h4>
                {formData.questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="text-red-600 hover:text-red-800 p-1"
                    aria-label="Eliminar pregunta"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Texto de la pregunta</label>
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de pregunta</label>
                  <select
                    value={question.type}
                    onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {Object.entries(SurveyQuestionType).map(([key, value]) => (
                      <option key={key} value={value}>{getQuestionTypeName(value)}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`required-${index}`}
                    checked={question.required}
                    onChange={(e) => handleQuestionChange(index, 'required', e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor={`required-${index}`} className="ml-2 block text-sm text-gray-700">
                    ¿Pregunta obligatoria?
                  </label>
                </div>
              </div>

              {(question.type === SurveyQuestionType.SELECT || question.type === SurveyQuestionType.BOOLEAN) && (
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Opciones</label>
                    <button
                      type="button"
                      onClick={() => addOption(index)}
                      className="text-primary hover:text-primary-dark text-sm flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Agregar opción
                    </button>
                  </div>
                  
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder={`Opción ${optionIndex + 1}`}
                        required
                      />
                      {question.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index, optionIndex)}
                          className="ml-2 text-red-600 hover:text-red-800 p-1"
                          aria-label="Eliminar opción"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="mt-4">
            <button
              type="button"
              onClick={addQuestion}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Agregar pregunta
            </button>
          </div>
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
            {isEdit ? 'Guardar cambios' : 'Crear encuesta'}
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
        <p>{isEdit ? '¿Desea guardar los cambios?' : '¿Desea crear la encuesta?'}</p>
      </Modal>
    </div>
  );
};

export default SurveyForm;