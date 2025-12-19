import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../shared/context/AppContext';

const VerifyAccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { apiUrl, token } = useContext(AppContext);
  const [passInfo, setPassInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [success, setSuccess] = useState(false);

  const passToken = searchParams.get('token');

  useEffect(() => {
    if (!passToken) {
      setError('Token no proporcionado');
      setLoading(false);
      return;
    }

    fetchPassInfo();
  }, [passToken]);

  const fetchPassInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${apiUrl}/access/check-info/${passToken}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al verificar el pase');
      }

      const data = await response.json();
      setPassInfo(data);
    } catch (err) {
      setError(err.message || 'Error al verificar el pase');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmEntry = async () => {
    try {
      setRegistering(true);
      setError(null);

      const response = await fetch(`${apiUrl}/access/register-entry`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          passId: passInfo.pass.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar entrada');
      }

      const data = await response.json();
      setSuccess(true);

      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Error al registrar entrada');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
            <p className="mt-4 text-gray-600 font-medium">Verificando pase...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !passInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-4">
              <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Entrada Registrada!</h2>
            <p className="text-gray-600 mb-2">El acceso ha sido concedido exitosamente</p>
            <p className="text-sm text-gray-500">Redirigiendo...</p>
          </div>
        </div>
      </div>
    );
  }

  const isValid = passInfo?.valid;
  const pass = passInfo?.pass;

  return (
    <div className={`min-h-screen ${isValid ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-red-500 to-pink-600'} flex items-center justify-center p-4`}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🏌️ Club Campestre</h1>
          <p className="text-gray-600">Verificación de Acceso</p>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center mb-6">
          {isValid ? (
            <div className="bg-green-100 text-green-800 px-6 py-3 rounded-full font-bold text-lg">
              ✓ PASE VÁLIDO
            </div>
          ) : (
            <div className="bg-red-100 text-red-800 px-6 py-3 rounded-full font-bold text-lg">
              ✗ ACCESO DENEGADO
            </div>
          )}
        </div>

        {/* Message */}
        {!isValid && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-800 font-semibold">{passInfo?.message}</p>
          </div>
        )}

        {/* Pass Information */}
        {pass && (
          <div className="space-y-4 mb-6">
            {/* Host Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">SOCIO ANFITRIÓN</h3>
              <div className="space-y-1">
                <p className="text-lg font-bold text-gray-900">{pass.host.fullName}</p>
                {pass.host.memberCode && (
                  <p className="text-sm text-gray-600">Código de Socio: {pass.host.memberCode}</p>
                )}
                {pass.host.title && (
                  <p className="text-sm text-gray-600">Título: {pass.host.title}</p>
                )}
              </div>
            </div>

            {/* Guest Information */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-600 mb-2">INVITADO</h3>
              <div className="space-y-1">
                <p className="text-lg font-bold text-gray-900">{pass.guest.fullName}</p>
                <p className="text-sm text-gray-600">Email: {pass.guest.email}</p>
                <p className="text-sm text-gray-600">Teléfono: {pass.guest.phone}</p>
              </div>
            </div>

            {/* Entry Counter */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-purple-600 mb-2">CONTADOR DE ENTRADAS</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-purple-600">
                    {pass.entriesCount} / {pass.maxEntries}
                  </p>
                  <p className="text-sm text-gray-600">Entradas registradas</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{pass.remainingEntries}</p>
                  <p className="text-sm text-gray-600">Restantes</p>
                </div>
              </div>
            </div>

            {/* Last Entry */}
            {pass.lastEntry && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-1">ÚLTIMA ENTRADA</h3>
                <p className="text-sm text-gray-600">
                  {new Date(pass.lastEntry).toLocaleString('es-MX', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          {isValid && pass && (
            <button
              onClick={handleConfirmEntry}
              disabled={registering}
              className="flex-1 bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {registering ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registrando...
                </>
              ) : (
                '✓ CONFIRMAR INGRESO'
              )}
            </button>
          )}
          <button
            onClick={() => navigate('/')}
            className={`${isValid ? 'flex-1' : 'w-full'} bg-gray-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-700 transition-colors`}
          >
            {isValid ? 'Cancelar' : 'Volver'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccess;
