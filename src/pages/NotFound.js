import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <div className="text-6xl text-gray-300 mb-4">404</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Página no encontrada</h2>
      <p className="text-gray-600 mb-6">
        Lo sentimos, la página que buscas no existe.
      </p>
      <Link 
        to="/" 
        className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFound;
