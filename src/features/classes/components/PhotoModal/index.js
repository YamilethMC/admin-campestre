import React, { useRef, useState } from 'react';

/**
 * La fotografía del profesional (§5: "fotografías" configurables por el Club).
 *
 * Mientras no haya foto, la app lo muestra con sus iniciales. No es un error ni
 * un hueco: es el estado normal hasta que el Club entregue las suyas, y por eso
 * se ve igual aquí que en el teléfono del socio.
 *
 * Subir una foto **apaga la marca de dato demostrativo**: una ficha con su
 * fotografía real ya no es un ejemplo.
 */

const MAXIMO_MB = 5;
const TIPOS = ['image/jpeg', 'image/png', 'image/webp'];

const PhotoModal = ({ professional, onClose, onUpload, onRemove }) => {
  const entrada = useRef(null);
  const [previa, setPrevia] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const iniciales = professional.displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');

  const elegir = (evento) => {
    const f = evento.target.files?.[0];
    if (!f) return;

    if (!TIPOS.includes(f.type)) {
      setError('La foto debe ser JPEG, PNG o WebP');
      return;
    }
    if (f.size > MAXIMO_MB * 1024 * 1024) {
      setError(`La foto no puede pesar más de ${MAXIMO_MB} MB`);
      return;
    }

    setError('');
    setArchivo(f);
    setPrevia(URL.createObjectURL(f));
  };

  const subir = async () => {
    setGuardando(true);
    setError('');
    const resultado = await onUpload(professional, archivo);
    setGuardando(false);
    if (resultado?.success) onClose();
    else setError(resultado?.error || 'No se pudo subir la foto');
  };

  const quitar = async () => {
    setGuardando(true);
    const resultado = await onRemove(professional);
    setGuardando(false);
    if (resultado?.success) onClose();
    else setError(resultado?.error || 'No se pudo quitar la foto');
  };

  const mostrada = previa || professional.photoUrl;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Fotografía</h3>
          <p className="text-sm text-gray-500 mt-1">{professional.displayName}</p>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="flex justify-center">
            <div className="w-28 h-28 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
              {mostrada ? (
                <img src={mostrada} alt={professional.displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-semibold text-gray-400">{iniciales}</span>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center">
            {professional.photoUrl
              ? 'Así lo ve el socio en la app.'
              : 'Sin foto, el socio lo ve con sus iniciales.'}
          </p>

          <input
            ref={entrada}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={elegir}
            className="hidden"
          />

          <button
            onClick={() => entrada.current?.click()}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            {archivo ? archivo.name : 'Elegir una foto'}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-3 py-2 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm"
            >
              Cerrar
            </button>
            <button
              onClick={subir}
              disabled={!archivo || guardando}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium text-white ${
                !archivo || guardando ? 'bg-gray-300' : 'bg-primary'
              }`}
            >
              {guardando ? 'Subiendo...' : 'Guardar'}
            </button>
          </div>

          {professional.photoUrl && !archivo && (
            <button
              onClick={quitar}
              disabled={guardando}
              className="w-full text-xs text-gray-500 hover:text-red-600"
            >
              Quitar la foto y volver a las iniciales
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
