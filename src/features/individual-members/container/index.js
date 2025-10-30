import React, { useState, useContext } from 'react';
import { AppContext } from '../../../shared/context/AppContext';
import IndividualMemberForm from '../components/IndividualMemberForm';

const IndividualMember = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-primary">Alta Individual de Socios</h2>
      
      <IndividualMemberForm/>
    </div>
  );
};

export default IndividualMember;