import React, { useEffect, useState } from 'react';

import AccessModal from '../../components/AccessModal';
import AgendaTable from '../../components/AgendaTable';
import ExceptionsPanel from '../../components/ExceptionsPanel';
import PricesForm from '../../components/PricesForm';
import ProfessionalFormModal from '../../components/ProfessionalFormModal';
import ProfessionalsTable from '../../components/ProfessionalsTable';
import ScheduleGrid from '../../components/ScheduleGrid';
import {
  useAgenda,
  useDisciplines,
  useExceptions,
  usePrices,
  useProfessionals,
  useSchedule,
} from '../../hooks/useClassesAdmin';
import { classesService } from '../../services';

const TABS = [
  { id: 'professionals', label: 'Profesionales' },
  { id: 'prices', label: 'Precios' },
  { id: 'agenda', label: 'Agenda' },
];

/**
 * Backoffice del módulo de Clases (§9 de la Especificación).
 *
 * Es lo que permite que el Club mantenga sus clases sin depender del equipo de
 * desarrollo: dar de alta profesionales, cargar sus horarios, bloquear fechas,
 * cambiar precios y consultar la agenda.
 *
 * La edición del horario y de los bloqueos de un profesional abre su propia
 * vista en vez de un modal: son pantallas grandes —una rejilla de 7 días por 17
 * horas— y encerrarlas en una ventanita las vuelve incómodas de usar.
 */
const ClassesAdmin = () => {
  const [tab, setTab] = useState('professionals');
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  /** Profesional cuyo horario y bloqueos se están editando. */
  const [managing, setManaging] = useState(null);
  // Profesional al que se le está dando o quitando el acceso al panel.
  const [access, setAccess] = useState(null);

  const { disciplines, load: loadDisciplines } = useDisciplines();
  const professionalsState = useProfessionals();
  const scheduleState = useSchedule();
  const exceptionsState = useExceptions();
  const pricesState = usePrices();
  const agendaState = useAgenda();

  useEffect(() => {
    loadDisciplines();
    professionalsState.load();
  }, []);

  useEffect(() => {
    if (tab === 'prices') pricesState.load();
  }, [tab]);

  const handleManageSchedule = async (professional) => {
    setManaging(professional);
    await Promise.all([
      scheduleState.load(professional.id),
      exceptionsState.load(professional.id),
    ]);
  };

  const handleSaveProfessional = async (payload, id) => {
    const ok = await professionalsState.save(payload, id);

    if (ok) {
      setShowForm(false);
      setEditing(null);
      professionalsState.load();
    }
  };

  const handleToggleActive = async (professional) => {
    const ok = await professionalsState.toggleActive(professional);
    if (ok) professionalsState.load();
  };

  const handleGrantAccess = async (professional, payload) => {
    const response = await classesService.grantAccess(professional.id, payload);
    if (response.success) professionalsState.load();
    return response;
  };

  const handleRevokeAccess = async (professional) => {
    const response = await classesService.revokeAccess(professional.id);
    if (response.success) professionalsState.load();
    return response;
  };

  const handleSaveSchedule = async (blocks) => {
    const ok = await scheduleState.save(managing.id, blocks);
    if (ok) professionalsState.load();
  };

  const error =
    professionalsState.error || scheduleState.error || exceptionsState.error || pricesState.error;

  // Vista de un profesional concreto: su horario y sus bloqueos.
  if (managing) {
    return (
      <div className="p-6 space-y-8">
        {error && <div className="bg-red-50 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>}

        <ScheduleGrid
          professional={managing}
          blocks={scheduleState.blocks}
          loading={scheduleState.loading}
          saving={scheduleState.saving}
          onSave={handleSaveSchedule}
          onCancel={() => setManaging(null)}
        />

        <hr className="border-gray-200" />

        <ExceptionsPanel
          professional={managing}
          exceptions={exceptionsState.exceptions}
          loading={exceptionsState.loading}
          lastAffected={exceptionsState.lastAffected}
          onDismissAffected={() => exceptionsState.setLastAffected(null)}
          onAdd={(payload) => exceptionsState.add(managing.id, payload)}
          onRemove={(exceptionId) => exceptionsState.remove(exceptionId, managing.id)}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clases</h1>
          <p className="text-sm text-gray-500">
            Profesionales, horarios, precios y agenda de las clases del Club
          </p>
        </div>
        {tab === 'professionals' && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            + Nuevo profesional
          </button>
        )}
      </div>

      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              tab === item.id
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error && <div className="bg-red-50 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">{error}</div>}

      {tab === 'professionals' && (
        <ProfessionalsTable
          professionals={professionalsState.professionals}
          loading={professionalsState.loading}
          onEdit={(professional) => {
            setEditing(professional);
            setShowForm(true);
          }}
          onToggleActive={handleToggleActive}
          onManageSchedule={handleManageSchedule}
          onManageAccess={(professional, modo) => setAccess({ professional, modo })}
        />
      )}

      {access && (
        <AccessModal
          professional={access.professional}
          modo={access.modo}
          onClose={() => setAccess(null)}
          onGrant={handleGrantAccess}
          onRevoke={handleRevokeAccess}
        />
      )}

      {tab === 'prices' && (
        <PricesForm
          prices={pricesState.prices}
          loading={pricesState.loading}
          saving={pricesState.saving}
          onSave={pricesState.save}
        />
      )}

      {tab === 'agenda' && (
        <AgendaTable
          professionals={professionalsState.professionals}
          bookings={agendaState.bookings}
          loading={agendaState.loading}
          onSearch={agendaState.load}
        />
      )}

      <ProfessionalFormModal
        open={showForm}
        professional={editing}
        disciplines={disciplines}
        saving={professionalsState.saving}
        onClose={() => {
          setShowForm(false);
          setEditing(null);
        }}
        onSubmit={handleSaveProfessional}
      />
    </div>
  );
};

export default ClassesAdmin;
