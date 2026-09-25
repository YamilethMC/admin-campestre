import { useCallback, useState } from 'react';
import { classesService } from '../services';

/**
 * Estado del backoffice de Clases.
 *
 * Se divide en varios hooks chicos en vez de uno grande: cada pestaña del panel
 * carga lo suyo y no arrastra lo que no usa.
 */

/** Muestra el error al usuario sin tragárselo en silencio. */
const notify = (setError, response) => {
  if (!response.success) {
    setError(response.error || 'Ocurrió un error');
    return false;
  }
  setError(null);
  return true;
};

export const useDisciplines = () => {
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const response = await classesService.getDisciplines();
    if (notify(setError, response)) setDisciplines(response.data || []);
    setLoading(false);
  }, []);

  return { disciplines, loading, error, load };
};

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async (disciplineId) => {
    setLoading(true);
    const response = await classesService.getProfessionals(disciplineId);
    if (notify(setError, response)) setProfessionals(response.data || []);
    setLoading(false);
  }, []);

  /** Crea o actualiza, según venga o no un id. */
  const save = useCallback(async (payload, id) => {
    setSaving(true);
    const response = id
      ? await classesService.updateProfessional(id, payload)
      : await classesService.createProfessional(payload);
    setSaving(false);
    return notify(setError, response);
  }, []);

  /**
   * Activa o desactiva. No se borra nunca: un profesional inactivo deja de
   * mostrarse en la app pero conserva su historial de clases (§11).
   */
  const toggleActive = useCallback(async (professional) => {
    const response = await classesService.updateProfessional(professional.id, {
      active: !professional.active,
    });
    return notify(setError, response);
  }, []);

  return { professionals, loading, saving, error, load, save, toggleActive };
};

export const useSchedule = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async (professionalId) => {
    setLoading(true);
    const response = await classesService.getSchedule(professionalId);
    if (notify(setError, response)) setBlocks(response.data || []);
    setLoading(false);
  }, []);

  /** Guarda la semana completa: lo que no va en la lista se elimina. */
  const save = useCallback(async (professionalId, nextBlocks) => {
    setSaving(true);
    const response = await classesService.replaceSchedule(professionalId, nextBlocks);
    if (notify(setError, response)) setBlocks(response.data || []);
    setSaving(false);
    return response.success;
  }, []);

  return { blocks, loading, saving, error, load, save };
};

export const useExceptions = () => {
  const [exceptions, setExceptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  /** Cuántas clases ya reservadas quedaron dentro del último bloqueo creado. */
  const [lastAffected, setLastAffected] = useState(null);

  const load = useCallback(async (professionalId) => {
    setLoading(true);
    const response = await classesService.getExceptions(professionalId);
    if (notify(setError, response)) setExceptions(response.data || []);
    setLoading(false);
  }, []);

  const add = useCallback(async (professionalId, payload) => {
    const response = await classesService.createException(professionalId, payload);

    if (!notify(setError, response)) return false;

    setLastAffected(response.data?.affectedBookings ?? 0);
    await load(professionalId);
    return true;
  }, [load]);

  const remove = useCallback(async (exceptionId, professionalId) => {
    const response = await classesService.deleteException(exceptionId);
    if (!notify(setError, response)) return false;
    await load(professionalId);
    return true;
  }, [load]);

  return { exceptions, loading, error, lastAffected, setLastAffected, load, add, remove };
};

export const usePrices = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const response = await classesService.getPrices();
    if (notify(setError, response)) setPrices(response.data || []);
    setLoading(false);
  }, []);

  const save = useCallback(async (nextPrices) => {
    setSaving(true);
    const response = await classesService.replacePrices(nextPrices);
    if (notify(setError, response)) setPrices(response.data || []);
    setSaving(false);
    return response.success;
  }, []);

  return { prices, loading, saving, error, load, save };
};

/**
 * Las reglas de operación: la general y las que cada disciplina tenga propias.
 *
 * Tras guardar o quitar se recarga la lista entera en vez de parchar en
 * memoria: el backend decide si una disciplina acaba con reglas propias o
 * heredando las generales, y duplicar aquí esa decisión sería pedir que un día
 * se despeguen.
 */
export const usePolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const response = await classesService.getPolicies();
    if (notify(setError, response)) setPolicies(response.data || []);
    setLoading(false);
  }, []);

  const save = useCallback(async (disciplineId, payload) => {
    setSaving(true);
    const response = disciplineId
      ? await classesService.saveDisciplinePolicy(disciplineId, payload)
      : await classesService.saveGeneralPolicy(payload);
    const ok = notify(setError, response);
    if (ok) await load();
    setSaving(false);
    return ok;
  }, [load]);

  const remove = useCallback(async (disciplineId) => {
    setSaving(true);
    const response = await classesService.removeDisciplinePolicy(disciplineId);
    const ok = notify(setError, response);
    if (ok) await load();
    setSaving(false);
    return ok;
  }, [load]);

  return { policies, loading, saving, error, load, save, remove };
};

/**
 * Los adeudos y sus movimientos.
 *
 * Tras cobrar o condonar se recarga la lista: el cargo sale del filtro actual
 * —ya no está pendiente— y quedarse con la fila en pantalla invitaría a
 * intentar moverlo otra vez.
 */
export const useCharges = () => {
  const [charges, setCharges] = useState([]);
  const [filtro, setFiltro] = useState('PENDING');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async (status = 'PENDING') => {
    setLoading(true);
    setFiltro(status);
    const response = await classesService.getCharges(status);
    if (notify(setError, response)) setCharges(response.data || []);
    setLoading(false);
  }, []);

  const resolve = useCallback(async (chargeId, accion, note) => {
    setSaving(true);
    const response = await classesService.resolveCharge(chargeId, accion, note);
    const ok = notify(setError, response);
    if (ok) await load(filtro);
    setSaving(false);
    return ok;
  }, [filtro, load]);

  return { charges, filtro, loading, saving, error, load, resolve };
};

export const useAgenda = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async (filters) => {
    setLoading(true);
    const response = await classesService.getAgenda(filters);
    if (notify(setError, response)) setBookings(response.data || []);
    setLoading(false);
  }, []);

  return { bookings, loading, error, load };
};
