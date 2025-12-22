import React from 'react';

const Modal = ({ isOpen, onClose, title, children, footer, showCloseButton = true }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 relative">
        {title && (
          <div className="border-b border-gray-200 p-4 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Cerrar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* If no title but close button is requested, add close button in the content area */}
        {!title && showCloseButton && (
          <div className="flex justify-end p-2">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Cerrar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        <div className="p-6">{children}</div>

        {footer && (
          <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-lg">{footer}</div>
        )}
      </div>
    </div>
  );
};

export default Modal;
