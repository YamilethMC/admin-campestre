import React from 'react';
import { useIndividualMember } from '../../hooks/useIndividualMember';

const IndividualMemberForm = () => {
  const { formData, genderOptions, loadingGender, tituloOptions, loadingTitulo, paymentMethodOptions, loadingPaymentMethod, handleChange, handleSubmit } = useIndividualMember();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Datos del Socio */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Datos del socio</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              required
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
              required
              disabled={loadingGender}
            >
              <option value="">Seleccione una opción...</option>
              {genderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {loadingGender && (
              <div className="text-xs text-gray-500 mt-1">Cargando opciones...</div>
            )}
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
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alias
                </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono fijo
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alias
                </label>
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
          
          <div className="border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono de emergencia
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alias
                </label>
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
      
      {/* Domicilio */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Domicilio</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Calle <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="calle"
              value={formData.calle}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número exterior <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="numero_exterior"
                value={formData.numero_exterior}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número interior
              </label>
              <input
                type="text"
                name="numero_interior"
                value={formData.numero_interior}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código postal <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="codigo_postal"
                value={formData.codigo_postal}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Colonia <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="colonia"
              value={formData.colonia}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ciudad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              País <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="pais"
              value={formData.pais}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Información adicional</h3>
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
      
      <div className="pt-4">
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Agregar Socio
        </button>
      </div>
    </form>
  );
};

export default IndividualMemberForm;