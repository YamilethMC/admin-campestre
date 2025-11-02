import React from 'react';
import { headerStyles } from './Style';

const NoticeHeader = ({ activeCount = 0, inactiveCount = 0 }) => {
  return (
    <div className={headerStyles.container}>
      <h2 className={headerStyles.title}>
        <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 7.625-4.5 0-2.398-1.36-3.862-3.937-3.862-1.312 0-2.686.5-3.168 1.394M4.934 13.683A3.998 3.998 0 002 10.5v-1.876c0-2.398 1.36-3.862 3.937-3.862 1.312 0 2.686.5 3.168 1.394M4.934 13.683L5 18h1.832a3.998 3.998 0 003.566-2.317M18 13v5h-5.832a3.998 3.998 0 01-3.566-2.317M18 13a3 3 0 100-6" />
        </svg>
        Avisos
      </h2>
      <p className="text-white opacity-90 mb-4">Gestiona los avisos importantes para los socios</p>
      
      <div className={headerStyles.statsContainer}>
        <div className={headerStyles.statBox}>
          <span className={headerStyles.statNumber}>{activeCount}</span>
          <span className={headerStyles.statLabel}>Activos</span>
        </div>
        <div className={headerStyles.statBox}>
          <span className={headerStyles.statNumber}>{inactiveCount}</span>
          <span className={headerStyles.statLabel}>Inactivos</span>
        </div>
        <div className={headerStyles.statBox}>
          <span className={headerStyles.statNumber}>{activeCount + inactiveCount}</span>
          <span className={headerStyles.statLabel}>Total</span>
        </div>
      </div>
    </div>
  );
};

export default NoticeHeader;