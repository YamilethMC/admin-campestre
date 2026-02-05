import React from 'react';

const Step1DatosSocio = ({ formData, handleChange, genderOptions, loadingGender, isDependent, isEditing }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-medium text-gray-500 mb-4 uppercase tracking-wide">Datos del socio</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de acción <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="code_socio"
            value={formData.code_socio}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apellidos <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sexo <span className="text-red-500">*</span>
          </label>
          <select
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            disabled={loadingGender}
          >
            <option value="">Seleccione una opción...</option>
            {genderOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            RFC <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="rfc"
            value={formData.rfc}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de nacimiento <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email {/*<span className="text-red-500">*</span>*/}
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        
        {isDependent && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Relación <span className="text-red-500">*</span>
            </label>
            <select
              name="relationship"
              value={formData.relationship}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">Seleccione una relación...</option>
              <option value="WIFE">Esposa</option>
              <option value="HUSBAND">Esposo</option>
              <option value="SON">Hijo</option>
              <option value="DAUGHTER">Hija</option>
              <option value="FATHER">Padre</option>
              <option value="MOTHER">Madre</option>
              <option value="BROTHER">Hermano</option>
              <option value="SISTER">Hermana</option>
              <option value="FRIEND">Amigo</option>
              <option value="OTHER">Otro</option>
            </select>
          </div>
        )}
        
        {!isEditing && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enviar credenciales por <span className="text-red-500">*</span>
            </label>
            <select
              name="notificationMethod"
              value={formData.notificationMethod}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="email">Email</option>
              {/*<option value="whatsapp">WhatsApp</option>*/}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              El usuario recibirá sus credenciales de acceso por este medio
            </p>
          </div>
        )}

        <div className="flex items-center md:col-span-2 pt-4">
          <input
            type="checkbox"
            name="foraneo"
            checked={formData.foraneo}
            onChange={handleChange}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">
            ¿Es foráneo?
          </label>
        </div>
      </div>
    </div>
  );
};

export default Step1DatosSocio;
