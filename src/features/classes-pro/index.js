import React, { useCallback, useContext, useEffect, useState } from 'react';

import { AppContext } from '../../shared/context/AppContext';
import ClaseFila from './components/ClaseFila';
import { classesProService } from './services';

/** 'YYYY-MM-DD' de hoy, sin pasar por new Date() para no cruzar el huso. */
const hoy = () => {
  const ahora = new Date();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  return `${ahora.getFullYear()}-${mes}-${dia}`;
};

const enDias = (dias) => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
};

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

/**
 * Nombre del día a partir de la cadena 'YYYY-MM-DD', armando el Date en hora
 * local y no con `new Date(cadena)`, que la interpretaría como UTC y en México
 * devolvería el día anterior.
 */
const nombreDelDia = (fecha) => {
  const [a, m, d] = fecha.split('-').map(Number);
  return DIAS[new Date(a, m - 1, d).getDay()];
};

/**
 * La agenda del profesor.
 *
 * No reusa AgendaTable del panel de administración porque esa pantalla resuelve
 * otro problema: el Club mira a todos los profesores a la vez y necesita el
 * selector. Aquí siempre es una sola persona, así que las clases se agrupan por
 * día, que es como el maestro las vive.
 *
 * Las fechas y horas se leen recortando la cadena que manda el backend, igual
 * que en el resto del módulo: el servidor guarda la hora de pared del club
 * dentro de un campo UTC, e interpretarla con la zona del navegador la correría.
 */
const MisClases = () => {
  const { currentUser } = useContext(AppContext);
  const [rango, setRango] = useState({ from: hoy(), to: enDias(14) });
  const [clases, setClases] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const buscar = useCallback(async (desde, hasta) => {
    setCargando(true);
    setError('');
    const resultado = await classesProService.getMyAgenda({ from: desde, to: hasta });
    if (resultado.success) {
      setClases(resultado.data || []);
    } else {
      setError(resultado.error);
      setClases([]);
    }
    setCargando(false);
  }, []);

  // Tras reportar algo se recarga el rango que está a la vista, en vez de
  // parchar la clase en memoria: el backend decide el status final y no vale
  // la pena duplicar aquí esa lógica.
  const reportar = async (llamada) => {
    const resultado = await llamada();
    if (resultado.success) await buscar(rango.from, rango.to);
    else setError(resultado.error);
  };

  useEffect(() => {
    buscar(rango.from, rango.to);
    // Sólo al montar: después el profesor busca cuando quiere.
  }, [buscar]);

  const porDia = clases.reduce((acumulado, clase) => {
    const dia = clase.startsAt.substring(0, 10);
    (acumulado[dia] = acumulado[dia] || []).push(clase);
    return acumulado;
  }, {});

  const dias = Object.keys(porDia).sort();

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Mis clases</h1>
        <p className="text-sm text-gray-500 mt-1">
          {currentUser?.name ? `${currentUser.name} ${currentUser.lastName || ''}` : 'Tu agenda'}
        </p>
      </div>

      <form
        onSubmit={(evento) => {
          evento.preventDefault();
          buscar(rango.from, rango.to);
        }}
        className="bg-gray-50 rounded-lg p-4 flex flex-wrap items-end gap-3"
      >
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Desde</label>
          <input
            type="date"
            value={rango.from}
            onChange={(e) => setRango((r) => ({ ...r, from: e.target.value }))}
            className="border border-gray-300 rounded-md px-2 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Hasta</label>
          <input
            type="date"
            value={rango.to}
            onChange={(e) => setRango((r) => ({ ...r, to: e.target.value }))}
            className="border border-gray-300 rounded-md px-2 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Buscar
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {cargando ? (
        <div className="py-10 text-center text-gray-500">Cargando tu agenda...</div>
      ) : dias.length === 0 && !error ? (
        <div className="py-10 text-center text-gray-500 bg-gray-50 rounded-lg">
          No tienes clases reservadas en esas fechas
        </div>
      ) : (
        <div className="space-y-5">
          {dias.map((dia) => (
            <div key={dia}>
              <h2 className="text-sm font-semibold text-gray-700 mb-2">
                <span className="capitalize">{nombreDelDia(dia)}</span>{' '}
                {dia.substring(8, 10)}/{dia.substring(5, 7)}
                <span className="ml-2 font-normal text-gray-400">
                  {porDia[dia].length} {porDia[dia].length === 1 ? 'clase' : 'clases'}
                </span>
              </h2>
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
                {porDia[dia].map((clase) => (
                  <ClaseFila
                    key={clase.id}
                    clase={clase}
                    onAsistencia={(c, vino) =>
                      reportar(() => classesProService.markAttendance(c.id, vino))
                    }
                    onPago={(c, pagada) =>
                      reportar(() => classesProService.markPayment(c.id, pagada))
                    }
                    onClima={(c, nota) =>
                      reportar(() => classesProService.weatherCancel(c.id, nota))
                    }
                    onImpago={(c) => reportar(() => classesProService.reportUnpaid(c.id))}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisClases;
