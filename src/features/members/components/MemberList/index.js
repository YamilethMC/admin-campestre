import React, { useContext } from 'react';
import { AppContext } from '../../../../shared/context/AppContext';

const MemberList = () => {
  const { members } = useContext(AppContext);
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-primary">Lista de Socios</h2>
      
      {members.length === 0 ? (
        <p className="text-gray-500">No hay socios registrados aún.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 overflow-y-auto max">
          <table className="min-w-full divide-y divide-gray-200 w-full">
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
              {members.map((member) => (
                <tr key={member.id} className={member.id % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.numero_socio}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.apellidos}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.sexo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.rfc}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.fecha_nacimiento}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.foraneo === 'true' || member.foraneo === '1' ? 'Sí' : 'No'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.telefono_movil}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.alias_movil}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.telefono_fijo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.alias_fijo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.telefono_emergencia}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.alias_emergencia}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.calle}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.numero_exterior}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.numero_interior}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.cp}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.colonia}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.ciudad}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.estado}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.pais}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.titulo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.profesion}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.metodo_pago}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.fecha_admision}</td>
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