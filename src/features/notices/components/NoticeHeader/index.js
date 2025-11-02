import React from 'react';
import { headerStyles } from './Style';

const NoticeHeader = ({ activeCount = 0, inactiveCount = 0 }) => {
  return (
    <div className={headerStyles.container}>
      <div className={headerStyles.headerContent}>
        <div>
          <div className={headerStyles.titleSection}>
            <svg className={headerStyles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <h2 className={headerStyles.title}>Avisos</h2>
          </div>
          <p className={headerStyles.description}>Gestiona los avisos importantes para los socios</p>
        </div>
        
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
    </div>
  );
};

export default NoticeHeader;