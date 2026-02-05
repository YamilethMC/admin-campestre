import React, { useState } from 'react';
import StepIndicator from './StepIndicator';
import Step1DatosSocio from './Step1DatosSocio';
import Step2Telefonos from './Step2Telefonos';
import Step3Domicilio from './Step3Domicilio';
import Step4InfoAdicional from './Step4InfoAdicional';

const MultiStepForm = ({ 
  formData, 
  handleChange, 
  handleFormSubmit,
  genderOptions, 
  loadingGender,
  tituloOptions,
  loadingTitulo,
  paymentMethodOptions,
  loadingPaymentMethod,
  isDependent,
  isEditing
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [allowSubmit, setAllowSubmit] = useState(false);

  const steps = [
    { title: 'Datos del Socio', component: Step1DatosSocio },
    { title: 'Teléfonos', component: Step2Telefonos },
    { title: 'Domicilio', component: Step3Domicilio },
    { title: 'Información Adicional', component: Step4InfoAdicional },
  ];

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return (
          formData.code_socio &&
          formData.nombre &&
          formData.apellidos &&
          formData.sexo &&
          formData.rfc &&
          formData.fecha_nacimiento &&
          /*formData.email &&*/
          (!isDependent || formData.relationship)
        );
      case 2:
        return true;
        /*return formData.telefono_movil;*/
      case 3:
        return (
          formData.calle &&
          formData.numero_exterior &&
          formData.codigo_postal &&
          formData.colonia &&
          formData.ciudad &&
          formData.estado &&
          formData.pais
        );
      case 4:
        return (
          formData.titulo &&
          formData.metodo_pago &&
          formData.fecha_admision
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setAllowSubmit(false);
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      alert('Por favor complete todos los campos requeridos antes de continuar');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!allowSubmit) {
      return;
    }
    if (validateStep(currentStep)) {
      handleFormSubmit(e);
    } else {
      alert('Por favor complete todos los campos requeridos');
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <StepIndicator currentStep={currentStep} steps={steps} />

      <CurrentStepComponent
        formData={formData}
        handleChange={handleChange}
        genderOptions={genderOptions}
        loadingGender={loadingGender}
        tituloOptions={tituloOptions}
        loadingTitulo={loadingTitulo}
        paymentMethodOptions={paymentMethodOptions}
        loadingPaymentMethod={loadingPaymentMethod}
        isDependent={isDependent}
        isEditing={isEditing}
      />

      <div className="flex justify-between pt-4">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={handlePrevious}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Anterior
          </button>
        )}
        
        <div className={currentStep === 1 ? 'ml-auto' : ''}>
          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Siguiente
            </button>
          ) : (
            <button
              type="submit"
              onClick={() => setAllowSubmit(true)}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {isDependent ? "Agregar dependiente" : isEditing ? "Editar socio" : "Agregar socio"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default MultiStepForm;
