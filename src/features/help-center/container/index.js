import React, { useState } from 'react';
import HelpCenterHeader from '../components/HelpCenterHeader';
import HelpCenterList from '../components/HelpCenterList';
import HelpCenterForm from '../components/HelpCenterForm';
import { useHelpCenter } from '../hooks/useHelpCenter';

const HelpCenterContainer = () => {
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [currentHelpCenter, setCurrentHelpCenter] = useState(null);

  const {
    helpCenters,
    loading,
    loadHelpCenters,
    createHelpCenter,
    updateHelpCenter,
    getHelpCenterById,
    deleteHelpCenter,
    addToast
  } = useHelpCenter();

  // Handle adding a new help center
  const handleAddHelpCenter = () => {
    setCurrentHelpCenter(null);
    setView('form');
  };

  // Handle editing a help center
  const handleEditHelpCenter = async (helpCenter) => {
    try {
      // Get the full help center data
      const fullHelpCenter = await getHelpCenterById(helpCenter.id);
      if (fullHelpCenter) {
        setCurrentHelpCenter(fullHelpCenter);
        setView('form');
      }
    } catch (err) {
      console.error('Error fetching help center:', err);
    }
  };

  // Handle saving a help center (create or update)
  const handleSaveHelpCenter = async (helpCenterData) => {
    try {
      if (currentHelpCenter) {
        // Update existing help center
        await updateHelpCenter(currentHelpCenter.id, helpCenterData);
      } else {
        // Create new help center
        await createHelpCenter(helpCenterData);
      }
      setView('list');
    } catch (err) {
      console.error('Error saving help center:', err);
    }
  };

  // Handle canceling form
  const handleCancelForm = () => {
    setView('list');
    setCurrentHelpCenter(null);
  };

  // Handle deleting a help center
  const handleDeleteHelpCenter = async (id) => {
    try {
      await deleteHelpCenter(id);
    } catch (err) {
      console.error('Error deleting help center:', err);
    }
  };

  // Render the current view
  if (view === 'form') {
    return (
      <HelpCenterForm
        helpCenter={currentHelpCenter}
        onSave={handleSaveHelpCenter}
        onCancel={handleCancelForm}
      />
    );
  }

  // Default list view - show content even if loading
  return (
    <div>
      <HelpCenterHeader />

      <HelpCenterList
        helpCenters={helpCenters}
        loading={loading}
        onAddHelpCenter={handleAddHelpCenter}
        onEdit={handleEditHelpCenter}
        onDelete={handleDeleteHelpCenter}
      />
    </div>
  );
};

export default HelpCenterContainer;