import React, { useState, useEffect } from 'react';
import { useIndividualMember } from '../../hooks/useIndividualMember';

const IndividualMemberForm = ({ onCancel, loadMembers, initialData = null, memberId = null, isDependent = false }) => {
  const { formData, genderOptions, loadingGender, tituloOptions, loadingTitulo, paymentMethodOptions, loadingPaymentMethod, handleChange, handleSubmit, setFormData } = useIndividualMember();
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    if (initialData) {
      // Prellenar formulario con los datos del socio existente
      const formattedData = {
        code_socio: initialData.memberCode || '',
        nombre: initialData.user?.name || '',
        apellidos: initialData.user?.lastName || '',
        sexo: initialData.user?.gender || '',
        rfc: initialData.user?.RFC || '',
        fecha_nacimiento: initialData.user?.birthDate ? new Date(initialData.user.birthDate).toISOString().split('T')[0] : '',
        email: initialData.user?.email || '',
        telefono_movil: initialData.user?.phone?.find(p => p.type === 'MOVIL')?.number || '',
        alias_movil: initialData.user?.phone?.find(p => p.type === 'MOVIL')?.alias || '',
        telefono_fijo: initialData.user?.phone?.find(p => p.type === 'PHONE')?.number || '',
        alias_fijo: initialData.user?.phone?.find(p => p.type === 'PHONE')?.alias || '',
        telefono_emergencia: initialData.user?.phone?.find(p => p.type === 'EMERGENCY')?.number || '',
        alias_emergencia: initialData.user?.phone?.find(p => p.type === 'EMERGENCY')?.alias || '',
        foraneo: initialData.user?.foraneo || false,
        calle: initialData.user?.address?.street || '',
        numero_exterior: initialData.user?.address?.externalNumber || '',
        numero_interior: initialData.user?.address?.internalNumber || '',
        codigo_postal: initialData.user?.address?.zipCode || '',
        colonia: initialData.user?.address?.suburb || '',
        ciudad: initialData.user?.address?.city || '',
        estado: initialData.user?.address?.state || '',
        pais: initialData.user?.address?.country || '',
        titulo: initialData.title || '',
        profesion: initialData.profession || '',
        metodo_pago: initialData.paymentMethod || '',
        fecha_admision: initialData.dateOfAdmission ? new Date(initialData.dateOfAdmission).toISOString().split('T')[0] : '',
      };
      setFormData(formattedData);
    }
  }, [initialData, setFormData]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = async () => {
    // Perform the actual submission by calling the handleSubmit from the hook
    // If isDependent is true, we're adding a dependent (and memberId is the parent member ID)
    // If initialData?.id exists, we're editing an existing member
    // Otherwise, we're adding a new member
    let submissionSuccess;
    if (isDependent) {
      // Adding a dependent to a member
      submissionSuccess = await handleSubmit({ preventDefault: () => {} }, null, memberId);
    } else {
      // Editing or adding a regular member
      submissionSuccess = await handleSubmit({ preventDefault: () => {} }, initialData?.id);
    }
    setShowSubmitModal(false);

    // If submission was successful and we have loadMembers function, reload the list and go back
    if (submissionSuccess && loadMembers) {
      loadMembers(); // Reload the members list to show the updated member
      // Delay calling onCancel to allow UI updates to complete
      setTimeout(() => {
        if (onCancel) {
          onCancel();
        }
      }, 100);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Datos del Socio */}
      <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-medium text-gray-500 mb-4 uppercase tracking-wide">Datos del socio</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código del socio <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="code_socio"
              value={formData.code_socio}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              required
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
            {/*{loadingGender && (
              <div className="text-xs text-gray-500 mt-1">Cargando opciones...</div>
            )}*/}
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


      <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
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
        </div>
      </div>
      
      {/* Domicilio */}
      <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-medium text-gray-500 mb-4 uppercase tracking-wide">Domicilio</h3>
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

      <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
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
      
      <div className="pt-4">
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {initialData ? "Editar socio" : "Agregar socio"}
        </button>
      </div>

      {/* Confirmation Modal for Submit */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmar registro</h3>
            <p className="text-gray-600 mb-4">
              ¿Estás seguro que deseas registrar al socio? Verifica que todos los datos sean correctos.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                onClick={() => setShowSubmitModal(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none"
                onClick={handleConfirmSubmit}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default IndividualMemberForm;