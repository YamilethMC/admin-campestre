import React from 'react';

const Step2Telefonos = ({ formData, handleChange }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-medium text-gray-500 mb-4 uppercase tracking-wide">Teléfonos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono móvil <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="telefono_movil"
                value={formData.telefono_movil}
                onChange={handleChange}
                maxLength={10}
                pattern="\d{10}"
                inputMode="numeric"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alias</label>
              <input
                type="text"
                name="alias_movil"
                value={formData.alias_movil}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono fijo</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
              <input
                type="text"
                name="telefono_fijo"
                value={formData.telefono_fijo}
                onChange={handleChange}
                maxLength={10}
                pattern="\d{10}"
                inputMode="numeric"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alias</label>
              <input
                type="text"
                name="alias_fijo"
                value={formData.alias_fijo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono de emergencia
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
              <input
                type="text"
                name="telefono_emergencia"
                value={formData.telefono_emergencia}
                onChange={handleChange}
                maxLength={10}
                pattern="\d{10}"
                inputMode="numeric"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alias</label>
              <input
                type="text"
                name="alias_emergencia"
                value={formData.alias_emergencia}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2Telefonos;
