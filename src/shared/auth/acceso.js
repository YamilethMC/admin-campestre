// src/shared/auth/acceso.js
//
// Quién puede ver qué dentro del panel. Una sola lista, que consumen a la vez
// el menú lateral y las rutas.
//
// Está junto a propósito: esconder la entrada del menú no esconde la ruta. Si
// sólo se filtrara el menú, un profesor escribiría /socios en la barra del
// navegador y entraría igual. Cuando las dos cosas leen de aquí, no se pueden
// desincronizar.
//
// Esto es comodidad y claridad, no seguridad: la puerta de verdad está en el
// backend, que valida el tipo en cada petición. Aquí sólo se evita enseñarle a
// alguien pantallas que no le tocan.

export const TIPOS = {
  ADMINISTRADOR: 'ADMINISTRADOR',
  PROFESOR: 'PROFESOR',
};

/** Tipos de usuario que pueden entrar al panel. */
export const TIPOS_CON_PANEL = [TIPOS.ADMINISTRADOR, 'STAFF', TIPOS.PROFESOR];

/**
 * Lo único que ve el profesor. Todo lo demás del panel es del Club.
 */
const RUTAS_DEL_PROFESOR = ['/mis-clases'];

function coincide(rutas, ruta) {
  return rutas.some((r) => ruta === r || ruta.startsWith(`${r}/`));
}

/** La pantalla a la que se manda a cada quien al entrar. */
export function rutaInicial(tipo) {
  return tipo === TIPOS.PROFESOR ? RUTAS_DEL_PROFESOR[0] : '/';
}

/**
 * ¿Este tipo de usuario puede abrir esta ruta?
 *
 * Corta en los dos sentidos: el profesor sólo ve lo suyo, y al personal del
 * Club no se le ofrece "Mis clases", porque un administrador no tiene agenda
 * de profesor que mostrar.
 */
export function puedeVer(tipo, ruta) {
  if (tipo === TIPOS.PROFESOR) return coincide(RUTAS_DEL_PROFESOR, ruta);
  return !coincide(RUTAS_DEL_PROFESOR, ruta);
}

/** Filtra las entradas del menú para el tipo que entró. */
export function menuPara(tipo, items) {
  return items.filter((item) => puedeVer(tipo, item.path));
}
