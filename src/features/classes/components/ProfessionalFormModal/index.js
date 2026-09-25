import React, { useEffect, useState } from 'react';

const EMPTY = {
  disciplineId: '',
  displayName: '',
  shortBio: '',
  phone: '',
  email: '',
  photoUrl: '',
  isDemo: false,
};

/**
 * Alta y edición de un profesional.
 *
 * Los campos opcionales —foto, credencial, teléfono— siguen pendientes de que el
 * Club los entregue (§10), así que se dejan vacíos y no se inventan.
 */
const ProfessionalFormModal = ({ open, professional, disciplines, saving, onClose, onSubmit }) => {
  const [form, setForm] = useState(EMPTY);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (!open) return;

    setFormError(null);
    setForm(
      professional
        ? {
            disciplineId: String(professional.discipline?.id ?? professional.disciplineId ?? ''),
            displayName: professional.displayName ?? '',
            shortBio: professional.shortBio ?? '',
            isDemo: professional.isDemo ?? false,
            phone: professional.phone ?? '',
            email: professional.email ?? '',
            photoUrl: professional.photoUrl ?? '',
          }
        : EMPTY,
    );
  }, [open, professional]);

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.displayName.trim()) {
      setFormError('El nombre del profesional es obligatorio');
      return;
    }

    if (!form.disciplineId) {
      setFormError('Selecciona una disciplina');
      return;
    }

    // Los vacíos no se mandan: así el backend no guarda cadenas en blanco.
    const payload = {
      disciplineId: Number(form.disciplineId),
      displayName: form.displayName.trim(),
    };

    ['shortBio', 'phone', 'email', 'photoUrl'].forEach((field) => {
      if (form[field]?.trim()) payload[field] = form[field].trim();
    });

    // Sólo se manda al crear. Al editar, el backend la apaga solo: si el Club
    // acaba de escribir los datos reales, la ficha dejó de ser un ejemplo.
    if (!professional?.id) payload.isDemo = Boolean(form.isDemo);

    onSubmit(payload, professional?.id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-full overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {professional ? 'Editar profesional' : 'Nuevo profesional'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Disciplina</label>
            <select
              name="disciplineId"
              value={form.disciplineId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Selecciona una disciplina</option>
              {disciplines.map((discipline) => (
                <option key={discipline.id} value={discipline.id}>
                  {discipline.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              name="displayName"
              value={form.displayName}
              onChange={handleChange}
              placeholder="Ej. Fermín Gzz."
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Credencial o especialidad <span className="text-gray-400">(opcional)</span>
            </label>
            <input
              name="shortBio"
              value={form.shortBio}
              onChange={handleChange}
              placeholder="Ej. Entrenador Nacional"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {!professional?.id && (
            <label className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-md px-3 py-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="isDemo"
                checked={Boolean(form.isDemo)}
                onChange={(e) => handleChange({ target: { name: 'isDemo', value: e.target.checked } })}
                className="mt-0.5"
              />
              <span className="text-sm text-amber-900">
                Son datos de muestra
                <span className="block text-xs text-amber-700 mt-0.5">
                  Para ver el módulo funcionando mientras llegan los reales. Queda marcada como
                  demostrativa y el aviso se quita solo en cuanto edites la ficha.
                </span>
              </span>
            </label>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono <span className="text-gray-400">(opcional)</span>
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo <span className="text-gray-400">(opcional)</span>
              </label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de la foto <span className="text-gray-400">(opcional)</span>
            </label>
            <input
              name="photoUrl"
              value={form.photoUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Sin foto, la app muestra las iniciales del profesional.
            </p>
          </div>

          {formError && <p className="text-sm text-red-600">{formError}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfessionalFormModal;
