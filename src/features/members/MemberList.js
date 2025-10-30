import React, { useContext } from 'react';
import { AppContext } from '../../shared/context/AppContext';

const MemberList = () => {
  const { members } = useContext(AppContext);
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-primary">Lista de Socios</h2>
      
      {members.length === 0 ? (
        <p className="text-gray-500">No hay socios registrados aún.</p>
      ) : (
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
              {members.map((member) => (
                <tr key={member.id} className={member.id % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.numero_socio}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.apellidos}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.telefono}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.foraneo ? 'Sí' : 'No'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.direccion}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.id_sistema_entradas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600">
        Total de socios: {members.length}
      </div>
    </div>
  );
};

export default MemberList;