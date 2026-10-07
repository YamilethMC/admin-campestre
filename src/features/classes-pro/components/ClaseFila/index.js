import React, { useState } from 'react';

import ConfirmacionChip from '../../../classes/components/ConfirmacionChip';

/**
 * Una clase en la agenda del profesor, con lo que puede reportar sobre ella.
 *
 * §4 del encargo: "que el instructor pueda confirmar la asistencia y el pago,
 * así como reportar inasistencias o cancelaciones por mal clima".
 *
 * Los botones sólo aparecen cuando tienen sentido:
 *
 *   · La asistencia, **después** de la hora de la clase. Antes no hay nada que
 *     confirmar, y el backend la rechaza de todos modos.
 *   · El cobro, en cualquier momento: hay alumnos que pagan al llegar.
 *   · El mal clima, sólo mientras la clase sigue en pie.
 *
 * Una vez reportada la asistencia no se puede corregir desde aquí, a propósito:
 * de eso cuelga el cargo por inasistencia, y deshacerlo es decisión del Club,
 * no del profesor. El cobro sí se puede deshacer, porque se marca con las manos
 * ocupadas y el error de dedo es esperable.
 */
const ClaseFila = ({ clase, onAsistencia, onPago, onClima, onImpago, onHorariosLibres }) => {
  const [ocupado, setOcupado] = useState('');
  // Confirmación en línea, no window.prompt: es el único diálogo nativo que
  // habría en todo el panel, y el resto resuelve esto con interfaz propia.
  const [preguntandoClima, setPreguntandoClima] = useState(false);
  const [notaClima, setNotaClima] = useState('Campo cerrado por lluvia');
  // El horario que le propone al socio. Opcional: puede cancelar sin proponer.
  const [fechaOferta, setFechaOferta] = useState(clase.startsAt.substring(0, 10));
  const [horariosLibres, setHorariosLibres] = useState(null);
  const [horaOferta, setHoraOferta] = useState('');
  const [buscando, setBuscando] = useState(false);

  const yaEmpezo = new Date(clase.startsAt.replace('Z', '')) <= new Date();
  const cancelada = clase.status === 'CANCELLED';
  const reportada = Boolean(clase.attendanceAt);
  const pagada = Boolean(clase.paidAt);
  // Si la clase ya dejó un adeudo, se enseña en vez de volver a ofrecer el botón.
  const adeudo = clase.charge;

  const correr = async (etiqueta, accion) => {
    setOcupado(etiqueta);
    await accion();
    setOcupado('');
  };

  const confirmarClima = async () => {
    await correr('clima', () => onClima(clase, notaClima.trim(), fechaOferta, horaOferta));
    setPreguntandoClima(false);
    setHoraOferta('');
    setHorariosLibres(null);
  };

  const buscarHorarios = async (fecha) => {
    setFechaOferta(fecha);
    setHoraOferta('');
    setHorariosLibres(null);
    if (!fecha || !onHorariosLibres) return;
    setBuscando(true);
    const libres = await onHorariosLibres(clase, fecha);
    setHorariosLibres(libres);
    setBuscando(false);
  };

  return (
    <div className="px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-4 min-w-0">
        <span
          className={`text-base font-semibold tabular-nums ${
            cancelada ? 'text-gray-400 line-through' : 'text-gray-800'
          }`}
        >
          {clase.startsAt.substring(11, 16)}
        </span>
        <div className="min-w-0">
          <p className={`text-sm truncate ${cancelada ? 'text-gray-400' : 'text-gray-800'}`}>
            {clase.clubMember?.user?.name} {clase.clubMember?.user?.lastName}
            <span className="text-gray-400"> · #{clase.clubMember?.memberCode}</span>
          </p>
          <p className="text-xs text-gray-500">
            {clase.discipline?.name} · {clase.partySize}{' '}
            {clase.partySize === 1 ? 'persona' : 'personas'} · ${clase.priceSnapshot}
          </p>
          {clase.substituteName && (
            /* §3: el socio manda a alguien en su lugar. El profesor necesita el
               nombre y el teléfono para saber a quién recibe. */
            <p className="text-xs text-amber-700 mt-0.5">
              Viene en su lugar: <span className="font-medium">{clase.substituteName}</span>
              {clase.substitutePhone ? ` · ${clase.substitutePhone}` : ''}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {cancelada ? (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-600">
            {clase.cancelReason === 'WEATHER' ? 'Cancelada por clima' : 'Cancelada'}
          </span>
        ) : (
          <>
            {/* Antes de la clase: si el socio confirmó por WhatsApp. Después ya
                manda lo que el profesor reporte (asistió / no vino). */}
            {!yaEmpezo && <ConfirmacionChip reserva={clase} />}
            {reportada ? (
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  clase.status === 'NO_SHOW'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {clase.status === 'NO_SHOW' ? 'No se presentó' : 'Asistió'}
              </span>
            ) : (
              yaEmpezo && (
                <>
                  <button
                    disabled={Boolean(ocupado)}
                    onClick={() => correr('vino', () => onAsistencia(clase, true))}
                    className="px-3 py-1.5 text-xs font-medium rounded-md bg-green-600 text-white disabled:opacity-50"
                  >
                    {ocupado === 'vino' ? '...' : 'Asistió'}
                  </button>
                  <button
                    disabled={Boolean(ocupado)}
                    onClick={() => correr('falto', () => onAsistencia(clase, false))}
                    className="px-3 py-1.5 text-xs font-medium rounded-md border border-red-300 text-red-700 disabled:opacity-50"
                  >
                    {ocupado === 'falto' ? '...' : 'No vino'}
                  </button>
                </>
              )
            )}

            {adeudo && (
              <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                Adeudo ${adeudo.amount}
              </span>
            )}

            {!adeudo && reportada && clase.status === 'COMPLETED' && !pagada && onImpago && (
              <button
                disabled={Boolean(ocupado)}
                onClick={() => correr('impago', () => onImpago(clase))}
                className="px-3 py-1.5 text-xs rounded-md border border-red-300 text-red-700 disabled:opacity-50"
                title="Se dio la clase y no pagaron. El adeudo queda a nombre del socio"
              >
                {ocupado === 'impago' ? '...' : 'No pagó'}
              </button>
            )}

            <button
              disabled={Boolean(ocupado)}
              onClick={() => correr('pago', () => onPago(clase, !pagada))}
              className={`px-3 py-1.5 text-xs font-medium rounded-md disabled:opacity-50 ${
                pagada ? 'bg-green-100 text-green-800' : 'border border-gray-300 text-gray-600'
              }`}
              title={pagada ? 'Click para deshacer el cobro' : 'Marcar como pagada'}
            >
              {ocupado === 'pago' ? '...' : pagada ? 'Pagada' : 'Cobrar'}
            </button>

            {!reportada && (
              <button
                disabled={Boolean(ocupado)}
                onClick={() => setPreguntandoClima((v) => !v)}
                className="px-3 py-1.5 text-xs rounded-md text-gray-500 hover:text-gray-800 disabled:opacity-50"
                title="Cancelar por mal clima, sin penalización para el socio"
              >
                {ocupado === 'clima' ? '...' : 'Mal clima'}
              </button>
            )}
          </>
        )}
      </div>
      </div>

      {preguntandoClima && !cancelada && (
        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-md px-3 py-3">
          <p className="text-xs text-amber-900 mb-2">
            La clase se cancela sin penalización para el socio y el horario queda libre.
          </p>

          {/* §2: "ofrecer una reprogramación". Se le propone un hueco propio y se
              le aparta mientras decide. Si no se propone nada, sólo se cancela y
              el socio reserva cuando quiera, igual sin costo. */}
          {onHorariosLibres && (
            <div className="mb-3 border-t border-amber-200 pt-3">
              <p className="text-xs font-medium text-amber-900 mb-2">
                ¿Le propones otro horario? <span className="font-normal">(opcional)</span>
              </p>
              <input
                type="date"
                value={fechaOferta}
                onChange={(e) => buscarHorarios(e.target.value)}
                className="border border-amber-300 rounded-md px-2 py-1.5 text-sm mb-2"
              />
              {buscando && <p className="text-xs text-amber-700">Buscando tus horarios...</p>}
              {horariosLibres && horariosLibres.length === 0 && (
                <p className="text-xs text-amber-700">Ese día no tienes horarios libres.</p>
              )}
              {horariosLibres && horariosLibres.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {horariosLibres.map((h) => (
                    <button
                      key={h}
                      onClick={() => setHoraOferta(horaOferta === h ? '' : h)}
                      className={`px-2.5 py-1 text-xs rounded-md border ${
                        horaOferta === h
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'border-amber-300 text-amber-900'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              value={notaClima}
              onChange={(e) => setNotaClima(e.target.value)}
              placeholder="¿Qué pasó con el clima?"
              className="flex-1 min-w-[180px] border border-amber-300 rounded-md px-2 py-1.5 text-sm"
            />
            <button
              disabled={Boolean(ocupado)}
              onClick={confirmarClima}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-amber-600 text-white disabled:opacity-50"
            >
              {ocupado === 'clima'
                ? 'Cancelando...'
                : horaOferta
                  ? `Cancelar y proponer ${horaOferta}`
                  : 'Cancelar la clase'}
            </button>
            <button
              onClick={() => setPreguntandoClima(false)}
              className="px-3 py-1.5 text-xs rounded-md border border-gray-300 text-gray-600"
            >
              Mejor no
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaseFila;
