import React from 'react';

const Step4InfoAdicional = ({ formData, handleChange, tituloOptions, loadingTitulo, paymentMethodOptions, loadingPaymentMethod }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-medium text-gray-500 mb-4 uppercase tracking-wide">Información adicional</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titulo <span className="text-red-500">*</span>
          </label>
          <select
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            required
            disabled={loadingTitulo}
          >
            <option value="">Seleccione una opción...</option>
            {tituloOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {loadingTitulo && (
            <div className="text-xs text-gray-500 mt-1">Cargando opciones...</div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profesión
          </label>
          <input
            type="text"
            name="profesion"
            value={formData.profesion}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Método de pago <span className="text-red-500">*</span>
          </label>
          <select
            name="metodo_pago"
            value={formData.metodo_pago}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            required
            disabled={loadingPaymentMethod}
          >
            <option value="">Seleccione una opción...</option>
            {paymentMethodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {loadingPaymentMethod && (
            <div className="text-xs text-gray-500 mt-1">Cargando opciones...</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de admisión <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="fecha_admision"
            value={formData.fecha_admision}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default Step4InfoAdicional;
