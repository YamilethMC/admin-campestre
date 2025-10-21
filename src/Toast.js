import React, { useEffect } from 'react';
import { XIcon, CheckIcon, WarningIcon, InfoIcon } from './icons';

const Toast = ({ message, type, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const borderColor = type === 'error' 
    ? 'border-error' 
    : type === 'success' 
      ? 'border-success' 
      : type === 'warning'
        ? 'border-warning'
        : 'border-info';
        
  const IconComponent = type === 'error' 
    ? WarningIcon 
    : type === 'success' 
      ? CheckIcon 
      : type === 'warning'
        ? WarningIcon
        : InfoIcon;

  return (
    <div className={`fixed top-4 right-4 bg-white text-gray-800 px-4 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300 max-w-md border-l-4 ${borderColor}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <IconComponent className={`h-5 w-5 flex-shrink-0 mt-0.5 ${type === 'error' ? 'text-error' : type === 'success' ? 'text-success' : type === 'warning' ? 'text-warning' : 'text-info'}`} />
          <span className="text-sm">{message}</span>
        </div>
        <button 
          onClick={onClose}
          className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none flex-shrink-0"
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;