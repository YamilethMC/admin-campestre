import React from 'react';

const NoticeHeader = () => {
  return (
    <div className="bg-gradient-to-r from-primary to-primary-light rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center">
        <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm mr-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Avisos</h1>
          <p className="text-white text-opacity-90">Gestiona los avisos importantes para los socios</p>
        </div>
      </div>
    </div>
  );
};

export default NoticeHeader;