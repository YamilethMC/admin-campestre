import React, { useState } from 'react';

/**
 * Alta y baja del acceso al panel de un profesor.
 *
 * La contraseña se genera aquí y se enseña una sola vez, porque el backend la
 * guarda cifrada y después ya no hay forma de recuperarla: lo único que se
 * podría hacer es reemplazarla. Por eso el aviso de anotarla.
 *
 * El profesor entra con ella marcado como `mustChangePassword`, así que la
 * cambia en su primer ingreso y esta temporal deja de servir.
 */

const generarPassword = () => {
  // Sin caracteres que se confundan al dictarla por teléfono: O/0, l/1/I.
  const abc = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  const valores = new Uint32Array(12);
  window.crypto.getRandomValues(valores);
  return Array.from(valores, (v) => abc[v % abc.length]).join('');
};

const AccessModal = ({ professional, modo, onClose, onGrant, onRevoke }) => {
  const [email, setEmail] = useState(professional.email || '');
  const [password, setPassword] = useState(generarPassword);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [listo, setListo] = useState(false);

  const quitar = modo === 'revoke';

  const confirmar = async (evento) => {
    evento.preventDefault();
    setGuardando(true);
    setError('');

    const resultado = quitar
      ? await onRevoke(professional)
      : await onGrant(professional, { email: email.trim(), password });

    setGuardando(false);

    if (resultado?.success) {
      if (quitar) onClose();
      else setListo(true);
    } else {
      setError(resultado?.error || 'No se pudo completar la operación');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {quitar ? 'Quitar acceso' : 'Dar acceso al panel'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{professional.displayName}</p>
        </div>

        {listo ? (
          <div className="px-6 py-5 space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-md px-4 py-3 text-sm text-amber-900">
              Anota estos datos ahora. La contraseña no se vuelve a mostrar.
            </div>
            <dl className="text-sm space-y-2">
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Usuario</dt>
                <dd className="font-medium text-gray-900 break-all">{email}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Contraseña temporal</dt>
                <dd className="font-mono font-medium text-gray-900">{password}</dd>
              </div>
            </dl>
            <p className="text-xs text-gray-500">
              La cambiará la primera vez que entre. Sólo verá su propia agenda.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-primary text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Listo
            </button>
          </div>
        ) : (
          <form onSubmit={confirmar} className="px-6 py-5 space-y-4">
            {quitar ? (
              <p className="text-sm text-gray-600">
                Dejará de poder entrar al panel. Su ficha y sus clases pasadas se conservan, y se le
                puede volver a dar acceso cuando quieras.
              </p>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Correo con el que entrará
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="profesor@ejemplo.com"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Contraseña temporal
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setPassword(generarPassword())}
                      className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Otra
                    </button>
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-3 py-2 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={guardando}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium text-white ${
                  quitar ? 'bg-red-600' : 'bg-primary'
                } ${guardando ? 'opacity-60' : ''}`}
              >
                {guardando ? 'Guardando...' : quitar ? 'Quitar acceso' : 'Dar acceso'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AccessModal;
