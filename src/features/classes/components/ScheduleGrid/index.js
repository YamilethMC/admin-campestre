import React, { useEffect, useMemo, useState } from 'react';

/** Domingo primero, igual que el Date.getDay() que usa la app. */
const WEEKDAYS = [
  { value: 0, label: 'Dom' },
  { value: 1, label: 'Lun' },
  { value: 2, label: 'Mar' },
  { value: 3, label: 'Mié' },
  { value: 4, label: 'Jue' },
  { value: 5, label: 'Vie' },
  { value: 6, label: 'Sáb' },
];

/**
 * Horas que se pueden configurar.
 *
 * El Excel del Club va de 07:00 a 18:00; aquí se abre de 06:00 a 22:00 para que
 * puedan extender el horario sin pedirnos nada, que es el punto del §9.
 */
const HOURS = Array.from({ length: 17 }, (_, index) => `${String(index + 6).padStart(2, '0')}:00`);

/** Los tipos que el Club marca en cada bloque (§3). Sólo PARTICULAR es reservable. */
const BLOCK_TYPES = [
  { value: '', label: '—', style: 'bg-white text-gray-400' },
  { value: 'PARTICULAR', label: 'Particular', style: 'bg-emerald-100 text-emerald-800' },
  { value: 'CLUB', label: 'Club', style: 'bg-sky-100 text-sky-800' },
  { value: 'ACADEMIA', label: 'Academia', style: 'bg-amber-100 text-amber-800' },
  { value: 'DESCANSO', label: 'Descanso', style: 'bg-gray-200 text-gray-600' },
];

const keyOf = (weekday, hour) => `${weekday}-${hour}`;

/**
 * Rejilla del horario semanal de un profesional.
 *
 * Se edita la semana completa y se guarda de una: el backend reemplaza lo que
 * había. Por eso el botón dice "Guardar horario" y no guarda celda por celda —
 * si se guardara suelto, un fallo a media edición dejaría media semana cargada.
 *
 * Sólo los bloques marcados como "Particular" se le ofrecen al socio en la app.
 */
const ScheduleGrid = ({ professional, blocks, loading, saving, onSave, onCancel }) => {
  const [cells, setCells] = useState({});

  // Cada vez que llega un horario del servidor, se vuelca a la rejilla.
  useEffect(() => {
    const next = {};
    blocks.forEach((block) => {
      next[keyOf(block.weekday, block.startTime)] = block.sourceType;
    });
    setCells(next);
  }, [blocks]);

  const counters = useMemo(() => {
    const values = Object.values(cells).filter(Boolean);
    return {
      total: values.length,
      bookable: values.filter((type) => type === 'PARTICULAR').length,
    };
  }, [cells]);

  const handleChange = (weekday, hour, value) => {
    setCells((previous) => {
      const next = { ...previous };
      if (value) next[keyOf(weekday, hour)] = value;
      else delete next[keyOf(weekday, hour)];
      return next;
    });
  };

  /** Rellena una columna completa: el Club suele repetir el mismo patrón todo el día. */
  const fillDay = (weekday, value) => {
    setCells((previous) => {
      const next = { ...previous };
      HOURS.forEach((hour) => {
        if (value) next[keyOf(weekday, hour)] = value;
        else delete next[keyOf(weekday, hour)];
      });
      return next;
    });
  };

  const handleSave = () => {
    const payload = Object.entries(cells)
      .filter(([, sourceType]) => Boolean(sourceType))
      .map(([key, sourceType]) => {
        const [weekday, startTime] = key.split('-');
        return { weekday: Number(weekday), startTime, sourceType };
      });

    onSave(payload);
  };

  if (loading) {
    return <div className="py-10 text-center text-gray-500">Cargando horario...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Horario de {professional.displayName}
          </h3>
          <p className="text-sm text-gray-500">
            {counters.total} bloques configurados · {' '}
            <span className="text-emerald-700 font-medium">{counters.bookable} reservables</span> por
            el socio
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Volver
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar horario'}
          </button>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-3 text-xs">
        {BLOCK_TYPES.filter((type) => type.value).map((type) => (
          <span key={type.value} className={`px-2 py-1 rounded ${type.style}`}>
            {type.label}
          </span>
        ))}
        <span className="text-gray-500 ml-2">
          Sólo &quot;Particular&quot; se le ofrece al socio para reservar.
        </span>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Hora</th>
              {WEEKDAYS.map((day) => (
                <th key={day.value} className="px-2 py-2 text-center text-xs font-medium text-gray-500">
                  <div>{day.label}</div>
                  <select
                    value=""
                    onChange={(event) => fillDay(day.value, event.target.value)}
                    className="mt-1 text-xs border border-gray-200 rounded px-1 py-0.5 font-normal"
                    title="Aplicar a todo el día"
                  >
                    <option value="">Todo el día…</option>
                    {BLOCK_TYPES.map((type) => (
                      <option key={type.value || 'vacio'} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {HOURS.map((hour) => (
              <tr key={hour}>
                <td className="px-3 py-1 font-medium text-gray-700 whitespace-nowrap">{hour}</td>
                {WEEKDAYS.map((day) => {
                  const value = cells[keyOf(day.value, hour)] || '';
                  const style = BLOCK_TYPES.find((type) => type.value === value)?.style ?? '';

                  return (
                    <td key={day.value} className="px-1 py-1">
                      <select
                        value={value}
                        onChange={(event) => handleChange(day.value, hour, event.target.value)}
                        className={`w-full text-xs rounded px-1 py-1 border border-gray-200 ${style}`}
                      >
                        {BLOCK_TYPES.map((type) => (
                          <option key={type.value || 'vacio'} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleGrid;
