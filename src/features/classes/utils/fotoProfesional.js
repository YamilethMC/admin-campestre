/**
 * Reglas de la foto del profesional.
 *
 * Son las mismas que valida el backend al subirla (5 MB; JPEG, PNG o WebP). Se
 * revisan aquí también para que el Club vea el error al elegir el archivo y no
 * después de esperar la subida. Las usan el formulario y el modal de la foto.
 */

export const MAXIMO_MB = 5;
export const TIPOS = ['image/jpeg', 'image/png', 'image/webp'];
export const ACCEPT = TIPOS.join(',');

/** Devuelve el motivo por el que no sirve la foto, o null si sirve. */
export const validarFoto = (archivo) => {
  if (!TIPOS.includes(archivo.type)) return 'La foto debe ser JPEG, PNG o WebP';
  if (archivo.size > MAXIMO_MB * 1024 * 1024) return `La foto no puede pesar más de ${MAXIMO_MB} MB`;
  return null;
};

/** Las dos primeras iniciales del nombre, para cuando no hay foto. */
export const iniciales = (nombre = '') =>
  nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');
