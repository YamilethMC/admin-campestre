import React from 'react';

const CsvPreview = ({ previewData, csvData }) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Previsualización de los primeros 5 registros:</h3>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Socio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellidos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sexo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RFC</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de nacimiento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foráneo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono movil</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alias teléfono móvil</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono fijo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alias teléfono fijo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono de emergencia</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alias teléfono de emergencia</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número exterior</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número interior</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código Postal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Colonia</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ciudad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">País</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profesión</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método de pago</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de admisión</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {previewData.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.numero_socio}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.apellidos}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.sexo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.rfc}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.fecha_nacimiento}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.foraneo === 'true' || row.foraneo === '1' ? 'Sí' : 'No'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.telefono_movil}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.alias_movil}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.telefono_fijo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.alias_fijo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.telefono_emergencia}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.alias_emergencia}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.calle}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.numero_exterior}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.numero_interior}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.cp}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.colonia}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.ciudad}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.estado}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.pais}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.titulo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.profesion}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.metodo_pago}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.fecha_admision}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        Total de registros en el archivo: {csvData.length}
      </div>
    </div>
  );
};

export default CsvPreview;