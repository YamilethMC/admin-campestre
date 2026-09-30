import React, { useEffect, useState } from 'react';

/**
 * Las reglas de operación de las clases (§5 del encargo).
 *
 * El Club cambia aquí duración, anticipación, ventana de cancelación y
 * porcentajes de cargo, sin depender de nosotros.
 *
 * Hay una regla general y, opcionalmente, una por disciplina que la pisa. Es lo
 * que deja preparados a Tenis, GYM y Pádel: cuando el Club dé de alta a sus
 * profesores, si necesitan reglas distintas se las pone aquí y listo.
 */

const CAMPOS = [
  {
    clave: 'durationMinutes',
    etiqueta: 'Duración de la clase',
    unidad: 'minutos',
    min: 15,
    max: 480,
  },
  {
    clave: 'maxAdvanceDays',
    etiqueta: 'Anticipación máxima para reservar',
    unidad: 'días',
    min: 1,
    max: 365,
  },
  {
    clave: 'cancellationWindowHours',
    etiqueta: 'Cancelar sin costo hasta',
    unidad: 'horas antes',
    min: 0,
    max: 168,
  },
  {
    clave: 'lateCancelChargePercent',
    etiqueta: 'Cargo por cancelar tarde',
    unidad: '%',
    min: 0,
    max: 100,
  },
  {
    clave: 'noShowChargePercent',
    etiqueta: 'Cargo por no presentarse',
    unidad: '%',
    min: 0,
    max: 100,
  },
  {
    clave: 'substituteWindowHours',
    etiqueta: 'Se admite sustituto hasta',
    unidad: 'horas antes',
    min: 0,
    max: 168,
  },
];

const Bloque = ({ titulo, subtitulo, valores, guardando, onGuardar, onQuitar }) => {
  const [borrador, setBorrador] = useState(valores);
  const [tocado, setTocado] = useState(false);

  useEffect(() => {
    setBorrador(valores);
    setTocado(false);
  }, [valores]);

  const cambiar = (clave, valor) => {
    setBorrador((previo) => ({ ...previo, [clave]: valor }));
    setTocado(true);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-medium text-gray-800">{titulo}</h3>
          {subtitulo && <p className="text-xs text-gray-500 mt-0.5">{subtitulo}</p>}
        </div>
        {onQuitar && (
          <button
            onClick={onQuitar}
            className="text-xs text-gray-500 hover:text-red-600 whitespace-nowrap"
            title="Vuelve a regirse por las reglas generales"
          >
            Quitar reglas propias
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CAMPOS.map((campo) => (
          <div key={campo.clave}>
            <label className="block text-xs font-medium text-gray-600 mb-1">{campo.etiqueta}</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={campo.min}
                max={campo.max}
                value={borrador[campo.clave] ?? ''}
                onChange={(e) => cambiar(campo.clave, e.target.value)}
                className="w-24 border border-gray-300 rounded-md px-2 py-1.5 text-sm"
              />
              <span className="text-xs text-gray-500">{campo.unidad}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        disabled={!tocado || guardando}
        onClick={() => {
          const limpio = {};
          CAMPOS.forEach((c) => {
            const n = Number(borrador[c.clave]);
            if (Number.isFinite(n)) limpio[c.clave] = n;
          });
          onGuardar(limpio);
        }}
        className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
          !tocado || guardando ? 'bg-gray-300' : 'bg-primary'
        }`}
      >
        {guardando ? 'Guardando...' : 'Guardar'}
      </button>
    </div>
  );
};

const PoliciesForm = ({ policies, disciplines, loading, saving, onSave, onRemove }) => {
  if (loading) {
    return <div className="py-10 text-center text-gray-500">Cargando las reglas...</div>;
  }

  const general = policies.find((p) => !p.disciplineId);
  const porDisciplina = policies.filter((p) => p.disciplineId);
  const sinReglasPropias = disciplines.filter(
    (d) => !porDisciplina.some((p) => p.disciplineId === d.id),
  );

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-600">
        Las reglas generales aplican a todas las disciplinas. Si alguna necesita otras, se le ponen
        aparte y ésas mandan.
      </p>

      <Bloque
        titulo="Reglas generales"
        subtitulo="Aplican a toda disciplina que no tenga las suyas"
        valores={general || {}}
        guardando={saving}
        onGuardar={(datos) => onSave(null, datos)}
      />

      {porDisciplina.map((p) => (
        <Bloque
          key={p.id}
          titulo={p.discipline?.name}
          subtitulo="Reglas propias: pisan a las generales"
          valores={p}
          guardando={saving}
          onGuardar={(datos) => onSave(p.disciplineId, datos)}
          onQuitar={() => onRemove(p.disciplineId)}
        />
      ))}

      {sinReglasPropias.length > 0 && (
        <div className="border border-dashed border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-2">
            Estas disciplinas se rigen por las generales. Dales las suyas si lo necesitan:
          </p>
          <div className="flex flex-wrap gap-2">
            {sinReglasPropias.map((d) => (
              <button
                key={d.id}
                onClick={() => onSave(d.id, general || {})}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                + {d.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PoliciesForm;
