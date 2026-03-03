import React, { useState, useEffect, useCallback, useContext } from 'react';
import { AppContext } from '../../shared/context/AppContext';

const RELATIONSHIP_LABELS = {
  SPOUSE: 'Cónyuge',
  CHILD: 'Hijo/a',
  WIFE: 'Esposa',
  HUSBAND: 'Esposo',
  SON: 'Hijo',
  DAUGHTER: 'Hija',
};

const DOC_LABELS = {
  SPOUSE: 'Acta de Matrimonio',
  CHILD: 'Acta de Nacimiento',
  WIFE: 'Acta de Matrimonio',
  HUSBAND: 'Acta de Matrimonio',
  SON: 'Acta de Nacimiento',
  DAUGHTER: 'Acta de Nacimiento',
};

const AdminDependentDetail = ({ dependentId, onBack, onApproved, onRejected }) => {
  const { authToken } = useContext(AppContext);
  const [dependent, setDependent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [actionError, setActionError] = useState(null);

  // Reject modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectReasonError, setRejectReasonError] = useState(null);

  // Approve confirm modal state
  const [showApproveModal, setShowApproveModal] = useState(false);

  const getToken = () => authToken || localStorage.getItem('authToken');

  const fetchDependent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        throw new Error('Tu sesión ha expirado. Inicia sesión nuevamente.');
      }

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/dependents/${dependentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Error ${res.status} al cargar el dependiente`);
      }

      const payload = await res.json();
      const dependentData = payload?.data ?? payload ?? null;
      setDependent(dependentData);
    } catch (err) {
      setError(err.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  }, [dependentId]);

  useEffect(() => {
    if (dependentId) fetchDependent();
  }, [dependentId, fetchDependent]);

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      setActionError(null);
      setActionSuccess(null);

      const token = getToken();
      if (!token) {
        throw new Error('Tu sesión ha expirado. Inicia sesión nuevamente.');
      }

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/dependents/${dependentId}/approve`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || `Error ${res.status} al aprobar el dependiente`);
      }

      setActionSuccess(`✅ Dependiente aprobado. Número de socio asignado: #${data.memberCode}`);
      setShowApproveModal(false);
      await fetchDependent();

      if (onApproved) setTimeout(() => onApproved(), 2500);
    } catch (err) {
      setActionError(err.message || 'Error al aprobar el dependiente');
      setShowApproveModal(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setRejectReasonError('El motivo de rechazo es requerido.');
      return;
    }
    if (rejectReason.trim().length < 10) {
      setRejectReasonError('El motivo debe tener al menos 10 caracteres.');
      return;
    }

    try {
      setActionLoading(true);
      setActionError(null);
      setActionSuccess(null);

      const token = getToken();
      if (!token) {
        throw new Error('Tu sesión ha expirado. Inicia sesión nuevamente.');
      }

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/dependents/${dependentId}/reject`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reason: rejectReason.trim() }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || `Error ${res.status} al rechazar el dependiente`);
      }

      setActionSuccess('✗ Dependiente rechazado. El socio titular ha sido notificado.');
      setShowRejectModal(false);
      setRejectReason('');
      await fetchDependent();

      if (onRejected) setTimeout(() => onRejected(), 2500);
    } catch (err) {
      setActionError(err.message || 'Error al rechazar el dependiente');
      setShowRejectModal(false);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <button onClick={onBack} className="text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="font-medium">Error al cargar el dependiente</p>
            <p className="text-sm mt-1">{error}</p>
            <button onClick={fetchDependent} className="mt-2 text-sm underline">Reintentar</button>
          </div>
        </div>
      </div>
    );
  }

  if (!dependent) return null;

  const isApproved = Boolean(dependent.memberCode);
  const isRejected = Boolean(
    dependent.validationSession?.status === 'REJECTED' ||
    dependent.rejectionReason ||
    (dependent.isDependentActive === false && dependent.memberCode)
  );
  const isPending = !isApproved && !isRejected;
  const hasDocument = !!dependent.relationshipDocumentUrl;
  const docLabel = DOC_LABELS[dependent.relationship] || 'Documento de Relación';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button onClick={onBack} className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a la lista
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Detalle de Dependiente</h1>
            </div>
          </div>

          {/* Status badge */}
          <div>
            {isApproved && (
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-sm font-medium px-3 py-1.5 rounded-full">
                ✓ Aprobado · #{dependent.memberCode}
              </span>
            )}
            {isRejected && (
              <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-sm font-medium px-3 py-1.5 rounded-full">
                ✗ Rechazado
              </span>
            )}
            {isPending && (
              <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 text-sm font-medium px-3 py-1.5 rounded-full">
                ⏳ Pendiente de validación
              </span>
            )}
          </div>
        </div>

        {actionSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {actionSuccess}
          </div>
        )}
        {actionError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-medium">Error</p>
            <p className="text-sm">{actionError}</p>
          </div>
        )}

        {/* Profile */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-500 overflow-hidden flex-shrink-0">
            {dependent.user?.profilePhotoUrl ? (
              <img src={dependent.user.profilePhotoUrl} alt="foto" className="w-full h-full object-cover" />
            ) : (
              (dependent.user?.name?.[0] || '?').toUpperCase()
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {dependent.user?.name} {dependent.user?.lastName}
            </h2>
            <p className="text-sm text-gray-500">
              {RELATIONSHIP_LABELS[dependent.relationship] || dependent.relationship}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Personal</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase">Correo electrónico</dt>
              <dd className="text-sm text-gray-800 mt-0.5">{dependent.user?.email || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase">Género</dt>
              <dd className="text-sm text-gray-800 mt-0.5">
                {dependent.user?.gender === 'MASCULINO'
                  ? 'Masculino'
                  : dependent.user?.gender === 'FEMENINO'
                  ? 'Femenino'
                  : dependent.user?.gender || '—'}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase">Fecha de nacimiento</dt>
              <dd className="text-sm text-gray-800 mt-0.5">
                {dependent.user?.birthDate
                  ? new Date(dependent.user.birthDate).toLocaleDateString('es-MX', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      timeZone: 'UTC',
                    })
                  : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase">Edad</dt>
              <dd className="text-sm text-gray-800 mt-0.5">
                {dependent.ageStatus ? `${dependent.ageStatus.age} años` : '—'}
              </dd>
            </div>
            {dependent.user?.phone && dependent.user.phone.length > 0 && (
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase">Teléfono</dt>
                <dd className="text-sm text-gray-800 mt-0.5">{dependent.user.phone[0].number}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Relationship & Membership */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Relación y Membresía</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase">Tipo de relación</dt>
              <dd className="text-sm text-gray-800 mt-0.5">
                {RELATIONSHIP_LABELS[dependent.relationship] || dependent.relationship}
              </dd>
            </div>
            {dependent.invitedBy && (
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase">Socio titular</dt>
                <dd className="text-sm text-gray-800 mt-0.5">
                  {dependent.invitedBy.user?.name} {dependent.invitedBy.user?.lastName}
                  {dependent.invitedBy.memberCode && (
                    <span className="ml-1 text-gray-400">(#{dependent.invitedBy.memberCode})</span>
                  )}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase">Número de socio</dt>
              <dd className="text-sm text-gray-800 mt-0.5">
                {dependent.memberCode ? (
                  <span className="font-medium">#{dependent.memberCode}</span>
                ) : (
                  <span className="text-gray-400 italic">No asignado</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500 uppercase">Cuenta activa</dt>
              <dd className="text-sm mt-0.5">
                <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
                  dependent.user?.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {dependent.user?.active ? '✓ Activa' : '✗ Inactiva'}
                </span>
              </dd>
            </div>
            {dependent.requiresPayment && (
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase">Cuota</dt>
                <dd className="text-sm text-orange-700 mt-0.5">Requiere pago (25–37 años)</dd>
              </div>
            )}
            {dependent.ageStatus?.isExpired && (
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase">Expiración</dt>
                <dd className="text-sm text-red-700 mt-0.5">⚠ Dependiente expirado (38+ años)</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Relationship Document */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📎 {docLabel}</h3>

        {hasDocument ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">Documento cargado</p>
                  <p className="text-xs text-green-600">El socio ha subido el documento de relación</p>
                </div>
              </div>

              {dependent.relationshipDocumentSignedUrl ? (
                <a
                  href={dependent.relationshipDocumentSignedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Ver documento
                </a>
              ) : (
                <span className="text-xs text-gray-500 italic">URL expirada, recarga para renovar</span>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-orange-800">Documento pendiente</p>
              <p className="text-xs text-orange-600 mt-1">
                El socio aún no ha subido el {docLabel.toLowerCase()}. No es posible aprobar sin documento.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Actions — only show if pending */}
      {isPending && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Acciones de Validación</h3>
          <p className="text-sm text-gray-500 mb-4">
            {hasDocument
              ? 'Revisa el documento de relación y aprueba o rechaza el registro del dependiente.'
              : 'El socio no ha subido el documento de relación. Puedes rechazar o esperar a que lo suba.'}
          </p>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setShowApproveModal(true)}
              disabled={actionLoading || !hasDocument}
              className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              title={!hasDocument ? 'Se requiere documento de relación para aprobar' : 'Aprobar dependiente'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Aprobar
            </button>
            <button
              onClick={() => { setShowRejectModal(true); setRejectReason(''); setRejectReasonError(null); }}
              disabled={actionLoading}
              className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Rechazar
            </button>
          </div>
          {!hasDocument && (
            <p className="text-xs text-orange-600 mt-2">
              ⚠ Se requiere documento de relación para poder aprobar.
            </p>
          )}
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Confirmar aprobación</h3>
            </div>
            <p className="text-gray-600 mb-2">
              ¿Confirmas aprobar el registro de{' '}
              <strong>{dependent.user?.name} {dependent.user?.lastName}</strong> como dependiente?
            </p>
            <ul className="text-sm text-gray-500 list-disc list-inside mb-4 space-y-1">
              <li>Se generará un número de socio automáticamente</li>
              <li>Se activará la cuenta del dependiente</li>
              <li>Se enviará un correo con las credenciales de acceso</li>
            </ul>
            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                    Aprobando...
                  </>
                ) : (
                  'Confirmar aprobación'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Rechazar dependiente</h3>
            </div>
            <p className="text-gray-600 mb-1">
              Estás rechazando el registro de{' '}
              <strong>{dependent.user?.name} {dependent.user?.lastName}</strong>.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              El socio titular será notificado en la aplicación con el motivo del rechazo.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo del rechazo <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => { setRejectReason(e.target.value); setRejectReasonError(null); }}
                rows={4}
                maxLength={500}
                placeholder="Describe el motivo del rechazo (mínimo 10 caracteres)..."
                className={`w-full px-3 py-2 border rounded-lg text-gray-800 text-sm resize-none focus:ring-2 focus:ring-red-400 focus:border-transparent ${
                  rejectReasonError ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              <div className="flex justify-between mt-1">
                {rejectReasonError ? (
                  <p className="text-xs text-red-600">{rejectReasonError}</p>
                ) : (
                  <span />
                )}
                <p className="text-xs text-gray-400">{rejectReason.length}/500</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowRejectModal(false); setRejectReason(''); setRejectReasonError(null); }}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                    Rechazando...
                  </>
                ) : (
                  'Confirmar rechazo'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDependentDetail;
