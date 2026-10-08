import React from 'react';

/**
 * Si el socio confirmó que va a su clase (encargo de Carlos del 6/oct/2026).
 *
 * Cuando se acerca la clase, el socio recibe un WhatsApp con un link para
 * confirmarla. Aquí se ve en qué quedó, para que el Club y el profesor sepan a
 * quién esperar. No hay cancelación automática: "Sin confirmar" es un aviso, y
 * el profesor decide si le llama.
 */
export const estadoDeConfirmacion = (reserva) => {
  if (reserva.status !== 'CONFIRMED') return null;
  if (reserva.memberConfirmedAt) {
    return { texto: 'Confirmó', clase: 'bg-green-100 text-green-800' };
  }
  if (reserva.reminderSentAt) {
    return { texto: 'Sin confirmar', clase: 'bg-amber-100 text-amber-800' };
  }
  return { texto: 'Aún no se le pide', clase: 'bg-gray-100 text-gray-600' };
};

const ConfirmacionChip = ({ reserva }) => {
  const estado = estadoDeConfirmacion(reserva);
  if (!estado) return null;

  return (
    <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${estado.clase}`}>
      {estado.texto}
    </span>
  );
};

export default ConfirmacionChip;
