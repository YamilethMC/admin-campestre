import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const LogPanel = () => {
  const { logs } = useContext(AppContext);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-primary">Panel de Logs</h2>

      <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto border border-gray-200">
        {logs.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay mensajes de registro aún.</p>
        ) : (
          <ul className="space-y-1">
            {logs.map((log, index) => (
              <li
                key={index}
                className="text-sm text-gray-700 font-mono bg-white p-2 rounded border border-gray-200"
              >
                {log}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LogPanel;
