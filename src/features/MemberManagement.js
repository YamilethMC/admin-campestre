import React, { useState } from 'react';
import IndividualMemberForm from '../../IndividualMemberForm';
import BulkMemberUpload from './bulk-upload';
import AccountStatementUpload from './accounting';
import MemberList from './members/MemberList';
import LogPanel from './LogPanel';

const MemberManagement = () => {
  // Mock initial data for members
  const [members, setMembers] = useState([
    {
      id: 1,
      numero_socio: 1,
      nombre: 'Juan',
      apellidos: 'Pérez García',
      email: 'juan.perez@example.com',
      telefono: '555-1234',
      foraneo: false,
      direccion: 'Calle Falsa 123',
      id_sistema_entradas: 'ENT-001',
    },
    {
      id: 2,
      numero_socio: 2,
      nombre: 'María',
      apellidos: 'López Rodríguez',
      email: 'maria.lopez@example.com',
      telefono: '555-5678',
      foraneo: true,
      direccion: 'Avenida Siempre Viva 456',
      id_sistema_entradas: 'ENT-002',
    },
  ]);

  const [logs, setLogs] = useState(['Sistema iniciado correctamente', 'Datos iniciales cargados']);

  const addLog = message => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Function to add a single member
  const addMember = memberData => {
    const newMember = {
      ...memberData,
      id: members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1,
    };

    setMembers(prev => [...prev, newMember]);
    addLog(
      `Socio agregado: ${newMember.nombre} ${newMember.apellidos} (N° ${newMember.numero_socio})`,
    );
  };

  // Function to add multiple members
  const addMembers = membersData => {
    const newMembers = membersData.map((member, index) => ({
      ...member,
      id: members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 + index : 1 + index,
    }));

    setMembers(prev => [...prev, ...newMembers]);
    addLog(`Se agregaron ${newMembers.length} socios desde archivo CSV`);
  };

  return (
    <div className="space-y-6">
      <IndividualMemberForm onAddMember={addMember} addLog={addLog} />
      <BulkMemberUpload onAddMembers={addMembers} addLog={addLog} />
      <AccountStatementUpload members={members} addLog={addLog} />
      <MemberList members={members} />
      <LogPanel logs={logs} />
    </div>
  );
};

export default MemberManagement;
