import React, { useState } from 'react';

const EMPTY = { date: '', startTime: '', action: 'BLOCK', reason: '' };

/**
 * Bloqueos y aperturas extraordinarias de un profesional (§6 y §9).
 *
 * Bloquear cierra un horario que normalmente estaría disponible —vacaciones, un
 * torneo, una incapacidad—. Abrir hace lo contrario: habilita una hora que el
 * horario semanal no contempla.
 *
 * Al bloquear, el backend avisa cuántas clases YA reservadas caen dentro. No se
 * cancelan solas: cancelarle la clase a un socio sin avisarle sería peor que el
 * problema que resuelve, y la política de cancelación sigue pendiente del Club.
 */
const ExceptionsPanel = ({ professional, exceptions, loading, lastAffected, onDismissAffected, onAdd, onRemove }) => {
  const [form, setForm] = useState(EMPTY);
  const [formError, setFormError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.date) {
      setFormError('Elige una fecha');
      return;
    }

    if (form.action === 'OPEN' && !form.startTime) {
      setFormError('Para abrir un horario extraordinario hay que indicar la hora');
      return;
    }

    setFormError(null);

    const payload = { date: form.date, action: form.action };
    if (form.startTime) payload.startTime = form.startTime;
    if (form.reason.trim()) payload.reason = form.reason.trim();

    const ok = await onAdd(payload);
    if (ok) setForm(EMPTY);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Bloqueos y aperturas de {professional.displayName}
        </h3>
        <p className="text-sm text-gray-500">
          Afectan sólo a la fecha indicada; el horario semanal no se toca.
        </p>
      </div>

      {lastAffected !== null && (
        <div
          className={`rounded-lg px-4 py-3 text-sm flex items-start justify-between gap-4 ${
            lastAffected > 0 ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-800'
          }`}
        >
          <span>
            {lastAffected > 0
              ? `Ojo: ${lastAffected} clase(s) ya reservada(s) caen dentro de este bloqueo. No se cancelaron: avísale al socio o cancélalas desde la agenda.`
              : 'Listo. No había clases reservadas dentro de ese rango.'}
          </span>
          <button type="button" onClick={onDismissAffected} className="text-current opacity-60 hover:opacity-100">
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-gray-600 mb-1">Acción</label>
          <select
            name="action"
            value={form.action}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm"
          >
            <option value="BLOCK">Bloquear</option>
            <option value="OPEN">Abrir horario extra</option>
          </select>
        </div>

        <div className="flex-1 min-w-[170px]">
          <label className="block text-xs font-medium text-gray-600 mb-1">Fecha</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm"
          />
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Hora {form.action === 'BLOCK' && <span className="text-gray-400">(vacío = todo el día)</span>}
          </label>
          <input
            type="time"
            name="startTime"
            step="3600"
            value={form.startTime}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm"
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-gray-600 mb-1">Motivo</label>
          <input
            name="reason"
            value={form.reason}
            onChange={handleChange}
            placeholder="Ej. Torneo"
            className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-sm"
        >
          Agregar
        </button>

        {formError && <p className="w-full text-sm text-red-600">{formError}</p>}
      </form>

      {loading ? (
        <div className="py-8 text-center text-gray-500">Cargando...</div>
      ) : exceptions.length === 0 ? (
        <div className="py-8 text-center text-gray-500 bg-gray-50 rounded-lg">
          No hay bloqueos ni aperturas para este profesional
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Hora</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {exceptions.map((exception) => (
                <tr key={exception.id}>
                  <td className="px-4 py-2 text-gray-800">{exception.date}</td>
                  <td className="px-4 py-2 text-gray-600">{exception.startTime || 'Todo el día'}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        exception.action === 'BLOCK'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {exception.action === 'BLOCK' ? 'Bloqueado' : 'Abierto'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-600">{exception.reason || '—'}</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => onRemove(exception.id)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      Quitar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExceptionsPanel;
