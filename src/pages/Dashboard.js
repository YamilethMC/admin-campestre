import React from 'react';
import logoImg from '../assets/images/logo-cct.jpeg';

const Dashboard = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md flex items-center justify-center">
      <img
        src={logoImg}
        alt="Logo"
        className="w-100 h-100 object-contain"
      />
    </div>
  );
};

export default Dashboard;
