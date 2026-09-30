// src/shared/api/sesion.js
//
// Dónde viven los tokens del panel y cómo se renueva la sesión.
//
// Se separa de api.js para que el envoltorio de peticiones no tenga que saber
// de almacenamiento, y para poder probar la renovación por su cuenta.

const CLAVE_ACCESO = 'authToken';
const CLAVE_REFRESH = 'refreshToken';

export const leerAcceso = () => {
  try {
    return localStorage.getItem(CLAVE_ACCESO);
  } catch {
    return null;
  }
};

export const leerRefresh = () => {
  try {
    return localStorage.getItem(CLAVE_REFRESH);
  } catch {
    return null;
  }
};

export const guardarSesion = ({ accessToken, refreshToken }) => {
  try {
    if (accessToken) localStorage.setItem(CLAVE_ACCESO, accessToken);
    if (refreshToken) localStorage.setItem(CLAVE_REFRESH, refreshToken);
  } catch {
    // Navegador en modo privado o con almacenamiento bloqueado: la sesión
    // sigue funcionando en memoria hasta que se recargue la página.
  }
};

export const borrarSesion = () => {
  try {
    localStorage.removeItem(CLAVE_ACCESO);
    localStorage.removeItem(CLAVE_REFRESH);
    localStorage.removeItem('currentUser');
  } catch {
    /* nada que hacer */
  }
};

/**
 * Una sola renovación a la vez.
 *
 * Cuando el token caduca, lo normal es que varias peticiones de la misma
 * pantalla reciban 401 al mismo tiempo. Si cada una pidiera su renovación, la
 * primera rotaría el refresh y las demás usarían uno ya revocado — y el
 * backend trata el reuso como robo y **cierra todas las sesiones del usuario**
 * (ver refreshSession en auth.service). Así que todas esperan a la misma.
 */
let enVuelo = null;

export const renovarSesion = async (urlBase) => {
  if (enVuelo) return enVuelo;

  const refresh = leerRefresh();
  if (!refresh) return Promise.resolve(null);

  enVuelo = (async () => {
    try {
      const respuesta = await fetch(`${urlBase}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refresh }),
      });

      if (!respuesta.ok) return null;

      const cuerpo = await respuesta.json();
      const datos = cuerpo?.data ?? cuerpo;

      if (!datos?.access_token) return null;

      // El refresh rota en cada uso: guardar el nuevo no es opcional.
      guardarSesion({
        accessToken: datos.access_token,
        refreshToken: datos.refresh_token,
      });

      return datos.access_token;
    } catch {
      return null;
    } finally {
      enVuelo = null;
    }
  })();

  return enVuelo;
};
