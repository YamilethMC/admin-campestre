import React from 'react';
import NoticeCard from '../NoticeCard';
import { listStyles } from './Style';

const NoticeList = ({ notices, filters, loading, onEdit, onToggleStatus, onDelete, onAddNotice }) => {
  if (loading && notices.length === 0) {
    // Show a skeleton loading state when loading and no notices are displayed yet
    return (
      <div>
        <div className={listStyles.container}>
          <h2 className={listStyles.title}>Lista de Avisos</h2>
          <button
            onClick={onAddNotice}
            className={listStyles.addButton}
          >
            <svg className={listStyles.addButtonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Agregar Aviso
          </button>
        </div>
        <div className="space-y-4">
          {/* Skeleton loading cards */}
          {[...Array(3)].map((_, index) => (
            <div key={index} className={listStyles.skeletonCard.container}>
              <div className={listStyles.skeletonCard.title}></div>
              <div className={listStyles.skeletonCard.description}></div>
              <div className={listStyles.skeletonCard.description2}></div>
              <div className={listStyles.skeletonCard.buttonsContainer}>
                <div className={listStyles.skeletonCard.button}></div>
                <div className={listStyles.skeletonCard.button}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={listStyles.container}>
        <h2 className={listStyles.title}>Lista de Avisos</h2>
        <button
          onClick={onAddNotice}
          className={listStyles.addButton}
        >
          <svg className={listStyles.addButtonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Agregar Aviso
        </button>
      </div>
      
      {notices.length === 0 ? (
        <div className={listStyles.noNoticesContainer}>
          <svg className={listStyles.noNoticesIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z" />
          </svg>
          <h3 className={listStyles.noNoticesTitle}>No hay ningún aviso registrado</h3>
          <p className={listStyles.noNoticesText}>No hay avisos disponibles con los filtros aplicados</p>
        </div>
      ) : (
        notices.map(notice => (
          <NoticeCard
            key={notice.id}
            notice={notice}
            onEdit={onEdit}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};

export default NoticeList;