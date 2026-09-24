import React, { useEffect, useState } from 'react';

/** 'YYYY-MM-DD' de hoy, sin pasar por new Date() para no cruzar el huso. */
const today = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
};

const inDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

/**
 * Agenda de clases reservadas (§9: "Consultar agenda/reservas por profesional y fecha").
 *
 * Las fechas y horas se leen recortando la cadena que manda el backend, no
 * construyendo un Date: el servidor guarda la hora de pared del club dentro de
 * un campo UTC, así que interpretarla con la zona del navegador la correría.
 */
const AgendaTable = ({ professionals, bookings, loading, onSearch }) => {
  const [filters, setFilters] = useState({ professionalId: '', from: today(), to: inDays(30) });

  useEffect(() => {
    onSearch(filters);
    // Sólo al montar: después el Club busca cuando quiere.
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((previous) => ({ ...previous, [name]: value }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    onSearch(filters);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="bg-gray-50 rounded-lg p-4 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-medium text-gray-600 mb-1">Profesional</label>
          <select
            name="professionalId"
            value={filters.professionalId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm"
          >
            <option value="">Todos</option>
            {professionals.map((professional) => (
              <option key={professional.id} value={professional.id}>
                {professional.displayName}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-gray-600 mb-1">Desde</label>
          <input
            type="date"
            name="from"
            value={filters.from}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm"
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-gray-600 mb-1">Hasta</label>
          <input
            type="date"
            name="to"
            value={filters.to}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-sm">
          Buscar
        </button>
      </form>

      {loading ? (
        <div className="py-10 text-center text-gray-500">Cargando agenda...</div>
      ) : bookings.length === 0 ? (
        <div className="py-10 text-center text-gray-500 bg-gray-50 rounded-lg">
          No hay clases reservadas en ese rango
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Hora</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Disciplina</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Profesional</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Socio</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Personas</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Precio</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-4 py-2 text-gray-800">{booking.startsAt.substring(0, 10)}</td>
                  <td className="px-4 py-2 text-gray-600">{booking.startsAt.substring(11, 16)}</td>
                  <td className="px-4 py-2 text-gray-600">{booking.discipline?.name}</td>
                  <td className="px-4 py-2 text-gray-600">{booking.professional?.displayName}</td>
                  <td className="px-4 py-2 text-gray-600">
                    {booking.clubMember?.user?.name} {booking.clubMember?.user?.lastName}
                    <span className="text-gray-400"> · #{booking.clubMember?.memberCode}</span>
                  </td>
                  <td className="px-4 py-2 text-gray-600">{booking.partySize}</td>
                  <td className="px-4 py-2 text-right font-medium text-gray-800">
                    ${booking.priceSnapshot}
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

export default AgendaTable;
