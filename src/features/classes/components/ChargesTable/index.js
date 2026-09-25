import React, { useState } from 'react';

/**
 * Los adeudos que dejan las clases, y lo que el Club hace con ellos.
 *
 * §4 del encargo: "el administrador deberá mostrar los adeudos pendientes y
 * permitir que el personal autorizado registre su pago, cancelación o
 * condonación, dejando un historial de quién realizó cada movimiento".
 *
 * El historial se muestra completo y no se puede editar: cada movimiento es una
 * línea nueva. Un historial que se puede reescribir no sirve de nada.
 *
 * "Condonar" y "anular" no son lo mismo y por eso están separados: condonar es
 * perdonarle al socio algo que sí debía; anular es reconocer que el cargo
 * estaba mal puesto. En la conversación con el socio eso importa.
 */

const MOTIVOS = {
  LATE_CANCEL: 'Canceló tarde',
  NO_SHOW: 'No se presentó',
  SUBSTITUTE_UNPAID: 'Sustituto sin pagar',
};

const ESTADOS = {
  PENDING: { texto: 'Pendiente', clase: 'bg-amber-100 text-amber-800' },
  PAID: { texto: 'Pagado', clase: 'bg-green-100 text-green-800' },
  WAIVED: { texto: 'Condonado', clase: 'bg-blue-100 text-blue-800' },
  CANCELLED: { texto: 'Anulado', clase: 'bg-gray-200 text-gray-600' },
};

const ACCIONES = {
  CREATED: 'Se generó',
  PAID: 'Cobrado',
  WAIVED: 'Condonado',
  CANCELLED: 'Anulado',
};

const FILTROS = [
  { id: 'PENDING', etiqueta: 'Pendientes' },
  { id: 'PAID', etiqueta: 'Pagados' },
  { id: 'WAIVED', etiqueta: 'Condonados' },
  { id: 'CANCELLED', etiqueta: 'Anulados' },
];

const Fila = ({ cargo, guardando, onResolver }) => {
  const [abierto, setAbierto] = useState(false);
  const [accion, setAccion] = useState(null);
  const [nota, setNota] = useState('');

  const socio = cargo.clubMember?.user;
  const estado = ESTADOS[cargo.status] || ESTADOS.PENDING;
  const pendiente = cargo.status === 'PENDING';

  const confirmar = async () => {
    await onResolver(cargo.id, accion, nota.trim());
    setAccion(null);
    setNota('');
  };

  return (
    <div className="border border-gray-200 rounded-lg">
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-gray-800">
            {socio?.name} {socio?.lastName}
            <span className="text-gray-400"> · #{cargo.clubMember?.memberCode}</span>
          </p>
          <p className="text-xs text-gray-500">
            {MOTIVOS[cargo.reason] || cargo.reason} · {cargo.booking?.discipline?.name} con{' '}
            {cargo.booking?.professional?.displayName} ·{' '}
            {cargo.booking?.startsAt?.substring(0, 10)} {cargo.booking?.startsAt?.substring(11, 16)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-base font-semibold text-gray-800 tabular-nums">
            ${cargo.amount}
          </span>
          <span className={`px-2 py-1 text-xs rounded-full ${estado.clase}`}>{estado.texto}</span>
          <button
            onClick={() => setAbierto((v) => !v)}
            className="text-xs text-gray-500 hover:text-gray-800"
          >
            {abierto ? 'Ocultar' : `Historial (${cargo.movements?.length || 0})`}
          </button>
        </div>
      </div>

      {abierto && (
        <div className="px-4 pb-3 border-t border-gray-100 pt-3">
          <ul className="space-y-1.5">
            {(cargo.movements || []).map((m) => (
              <li key={m.id} className="text-xs text-gray-600 flex flex-wrap gap-x-2">
                <span className="text-gray-400 tabular-nums">
                  {m.createdAt?.substring(0, 10)} {m.createdAt?.substring(11, 16)}
                </span>
                <span className="font-medium text-gray-700">{ACCIONES[m.action] || m.action}</span>
                <span>
                  por {m.user ? `${m.user.name} ${m.user.lastName}` : 'el sistema'}
                </span>
                {m.note && <span className="text-gray-500">— {m.note}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {pendiente && (
        <div className="px-4 pb-3 border-t border-gray-100 pt-3">
          {accion ? (
            <div className="flex flex-wrap gap-2 items-center">
              <input
                type="text"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                placeholder={
                  accion === 'PAID'
                    ? '¿Cómo pagó? Ej: efectivo en caja, recibo 4412'
                    : '¿Por qué? Queda en el historial'
                }
                className="flex-1 min-w-[200px] border border-gray-300 rounded-md px-2 py-1.5 text-sm"
              />
              <button
                disabled={guardando}
                onClick={confirmar}
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-white disabled:opacity-50"
              >
                {guardando ? 'Guardando...' : `Confirmar: ${ACCIONES[accion]}`}
              </button>
              <button
                onClick={() => setAccion(null)}
                className="px-3 py-1.5 text-xs rounded-md border border-gray-300 text-gray-600"
              >
                Mejor no
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setAccion('PAID')}
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-green-600 text-white"
              >
                Registrar pago
              </button>
              <button
                onClick={() => setAccion('WAIVED')}
                className="px-3 py-1.5 text-xs rounded-md border border-blue-300 text-blue-700"
                title="El socio sí debía, pero el Club se lo perdona"
              >
                Condonar
              </button>
              <button
                onClick={() => setAccion('CANCELLED')}
                className="px-3 py-1.5 text-xs rounded-md text-gray-500 hover:text-gray-800"
                title="El cargo estaba mal puesto"
              >
                Anular
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ChargesTable = ({ charges, loading, saving, filtro, onFiltrar, onResolver }) => (
  <div className="space-y-4">
    <div className="flex flex-wrap gap-2">
      {FILTROS.map((f) => (
        <button
          key={f.id}
          onClick={() => onFiltrar(f.id)}
          className={`px-3 py-1.5 text-sm rounded-md ${
            filtro === f.id ? 'bg-primary text-white' : 'border border-gray-300 text-gray-600'
          }`}
        >
          {f.etiqueta}
        </button>
      ))}
    </div>

    {loading ? (
      <div className="py-10 text-center text-gray-500">Cargando adeudos...</div>
    ) : charges.length === 0 ? (
      <div className="py-10 text-center text-gray-500 bg-gray-50 rounded-lg">
        {filtro === 'PENDING' ? 'No hay adeudos pendientes' : 'No hay nada aquí'}
      </div>
    ) : (
      <>
        {filtro === 'PENDING' && (
          <p className="text-sm text-gray-600">
            Suma pendiente:{' '}
            <span className="font-semibold text-gray-800">
              ${charges.reduce((total, c) => total + Number(c.amount), 0)}
            </span>{' '}
            en {charges.length} {charges.length === 1 ? 'adeudo' : 'adeudos'}
          </p>
        )}
        <div className="space-y-3">
          {charges.map((c) => (
            <Fila key={c.id} cargo={c} guardando={saving} onResolver={onResolver} />
          ))}
        </div>
      </>
    )}
  </div>
);

export default ChargesTable;
