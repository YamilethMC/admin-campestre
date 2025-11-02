import React, { useState } from 'react';
import NoticeHeader from '../components/NoticeHeader';
import NoticeFilters from '../components/NoticeFilters';
import NoticeList from '../components/NoticeList';
import NoticeForm from '../components/NoticeForm';
import { useNotice } from '../hooks/useNotice';

const NoticesContainer = () => {
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [currentNotice, setCurrentNotice] = useState(null);
  
  const {
    notices,
    loading,
    error,
    stats,
    filters,
    loadNotices,
    toggleNoticeStatus,
    createNotice,
    updateNotice,
    getNoticeById,
    updateFilters,
    deleteNotice
  } = useNotice();

  // Handle adding a new notice
  const handleAddNotice = () => {
    setCurrentNotice(null);
    setView('form');
  };

  // Handle editing a notice
  const handleEditNotice = async (notice) => {
    try {
      // Get the full notice data
      const fullNotice = await getNoticeById(notice.id);
      setCurrentNotice(fullNotice);
      setView('form');
    } catch (err) {
      console.error('Error fetching notice:', err);
    }
  };

  // Handle saving a notice (create or update)
  const handleSaveNotice = async (noticeData) => {
    try {
      if (currentNotice) {
        // Update existing notice
        await updateNotice(currentNotice.id, noticeData);
      } else {
        // Create new notice
        await createNotice(noticeData);
      }
      setView('list');
    } catch (err) {
      console.error('Error saving notice:', err);
    }
  };

  // Handle canceling form
  const handleCancelForm = () => {
    setView('list');
    setCurrentNotice(null);
  };

  // Handle deleting a notice
  const handleDeleteNotice = async (id) => {
    try {
      await deleteNotice(id);
    } catch (err) {
      console.error('Error deleting notice:', err);
    }
  };

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  // Render the current view
  if (view === 'form') {
    return (
      <NoticeForm
        notice={currentNotice}
        onSave={handleSaveNotice}
        onCancel={handleCancelForm}
      />
    );
  }

  // Default list view - show content even if loading
  return (
    <div>
      <NoticeHeader 
        activeCount={stats.active} 
        inactiveCount={stats.inactive} 
      />
      
      <NoticeFilters 
        filters={filters}
        onFilterChange={updateFilters}
      />
      
      <NoticeList
        notices={notices}
        filters={filters}
        loading={loading} // Pass loading state to the list component so it can handle it internally if needed
        onEdit={handleEditNotice}
        onToggleStatus={toggleNoticeStatus}
        onDelete={handleDeleteNotice}
        onAddNotice={handleAddNotice}
      />
    </div>
  );
};

export default NoticesContainer;