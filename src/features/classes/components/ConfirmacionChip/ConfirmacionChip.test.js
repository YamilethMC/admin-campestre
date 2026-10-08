import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import ClaseFila from '../../../classes-pro/components/ClaseFila';
import AgendaTable from '../AgendaTable';
import PoliciesForm from '../PoliciesForm';
import ConfirmacionChip, { estadoDeConfirmacion } from './index';

/**
 * Si el socio confirmó su clase por el WhatsApp. Se ve en la agenda del Club y
 * en la del profesor; no cancela nada solo.
 */

const MANANA = '2099-10-08T17:00:00.000Z';
const AYER = '2000-10-08T17:00:00.000Z';

const reserva = (extra = {}) => ({
  id: 38,
  startsAt: MANANA,
  status: 'CONFIRMED',
  memberConfirmedAt: null,
  reminderSentAt: null,
  partySize: 1,
  priceSnapshot: 400,
  discipline: { name: 'Golf' },
  professional: { displayName: 'Jimmy Díaz' },
  clubMember: { memberCode: 22308, user: { name: 'Ana', lastName: 'Ruiz' } },
  ...extra,
});

describe('estadoDeConfirmacion', () => {
  it('confirmó', () => {
    expect(estadoDeConfirmacion(reserva({ memberConfirmedAt: '2026-10-06T17:00:00Z' })).texto).toBe('Confirmó');
  });

  it('ya se le pidió y no ha contestado', () => {
    expect(estadoDeConfirmacion(reserva({ reminderSentAt: '2026-10-06T17:00:00Z' })).texto).toBe('Sin confirmar');
  });

  it('todavía no le toca el recordatorio', () => {
    expect(estadoDeConfirmacion(reserva()).texto).toBe('Aún no se le pide');
  });

  it('confirmar gana aunque ya se le haya mandado el recordatorio', () => {
    expect(
      estadoDeConfirmacion(
        reserva({ reminderSentAt: '2026-10-06T17:00:00Z', memberConfirmedAt: '2026-10-06T18:00:00Z' }),
      ).texto,
    ).toBe('Confirmó');
  });

  it.each(['CANCELLED', 'COMPLETED', 'NO_SHOW', 'PENDING'])('una clase %s no lleva chip', (status) => {
    expect(estadoDeConfirmacion(reserva({ status }))).toBeNull();
    const { container } = render(<ConfirmacionChip reserva={reserva({ status })} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('Agenda del Club', () => {
  it('tiene la columna Asistencia con el estado de cada clase', () => {
    render(
      <AgendaTable
        professionals={[]}
        bookings={[reserva({ reminderSentAt: '2026-10-06T17:00:00Z' })]}
        loading={false}
        onSearch={jest.fn()}
      />,
    );

    expect(screen.getByRole('columnheader', { name: 'Asistencia' })).toBeInTheDocument();
    expect(screen.getByText('Sin confirmar')).toBeInTheDocument();
  });
});

describe('Agenda del profesor', () => {
  const fila = (extra) =>
    render(
      <ClaseFila
        clase={reserva(extra)}
        onAsistencia={jest.fn()}
        onPago={jest.fn()}
        onClima={jest.fn()}
        onImpago={jest.fn()}
        onHorariosLibres={jest.fn()}
      />,
    );

  it('antes de la clase dice si el socio confirmó', () => {
    fila({ memberConfirmedAt: '2026-10-06T17:00:00Z' });

    expect(screen.getByText('Confirmó')).toBeInTheDocument();
  });

  it('después de la clase ya no: manda lo que reporte el profesor', () => {
    fila({ startsAt: AYER, reminderSentAt: '2000-10-06T17:00:00Z' });

    expect(screen.queryByText('Sin confirmar')).not.toBeInTheDocument();
  });
});

describe('Reglas', () => {
  it('el Club puede cambiar cuántas horas antes se pide la confirmación', () => {
    const onSave = jest.fn();
    render(
      <PoliciesForm
        policies={[{ id: 1, disciplineId: null, reminderHoursBefore: 48 }]}
        disciplines={[]}
        loading={false}
        saving={false}
        onSave={onSave}
        onRemove={jest.fn()}
      />,
    );

    const campo = screen.getByDisplayValue('48');
    expect(screen.getByText('Pedir confirmación por WhatsApp')).toBeInTheDocument();

    fireEvent.change(campo, { target: { value: '36' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(onSave).toHaveBeenCalledWith(null, expect.objectContaining({ reminderHoursBefore: 36 }));
  });
});
