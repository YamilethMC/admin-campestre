import React from 'react';
import logoImg from '../assets/images/SELLO.jpeg';

const Dashboard = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md flex items-center justify-center">
      <img
        src={logoImg}
        alt="Logo"
        className="w-96 h-96 object-contain flex-shrink-0"
      />
    </div>
  );
};

export default Dashboard;
