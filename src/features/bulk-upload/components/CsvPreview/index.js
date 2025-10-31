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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foráneo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Entradas</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {previewData.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.numero_socio}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.apellidos}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.telefono}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.foraneo === 'true' || row.foraneo === '1' ? 'Sí' : 'No'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.direccion}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.id_sistema_entradas}</td>
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