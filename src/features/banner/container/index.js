import React, { useState } from 'react';
import BannerHeader from '../components/BannerHeader';
import BannerFilters from '../components/BannerFilters';
import BannerList from '../components/BannerList';
import BannerForm from '../components/BannerForm';
import { useBanner } from '../hooks/useBanner';

const BannerContainer = () => {
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [currentBanner, setCurrentBanner] = useState(null);

  const {
    banners,
    loading,
    error,
    meta,
    status,
    setStatus,
    search,
    setSearch,
    page,
    setPage,
    loadBanners,
    createBanner,
    updateBanner,
    getBannerById,
    deleteBanner
  } = useBanner();

  // Update filters
  const updateFilters = (newFilters) => {
    if (newFilters.status !== undefined) {
      setStatus(newFilters.status);
      setPage(1);
    }
    if (newFilters.search !== undefined) {
      setSearch(newFilters.search);
      setPage(1);
    }
  };

  // Handle adding a new banner
  const handleAddBanner = () => {
    setCurrentBanner(null);
    setView('form');
  };

  // Handle editing a banner
  const handleEditBanner = async (banner) => {
    try {
      // Get the full banner data
      const fullBanner = await getBannerById(banner.id);
      setCurrentBanner(fullBanner);
      setView('form');
    } catch (err) {
      console.error('Error fetching banner:', err);
    }
  };

  // Handle saving a banner (create or update)
  const handleSaveBanner = async (bannerData) => {
    try {
      if (currentBanner) {
        // Update existing banner
        await updateBanner(currentBanner.id, bannerData);
      } else {
        // Create new banner
        await createBanner(bannerData);
      }
      setView('list');
    } catch (err) {
      console.error('Error saving banner:', err);
      // Stay on the form when there's an error
    }
  };

  // Handle canceling form
  const handleCancelForm = () => {
    setView('list');
    setCurrentBanner(null);
  };

  // Handle deleting a banner
  const handleDeleteBanner = async (id) => {
    try {
      await deleteBanner(id);
    } catch (err) {
      console.error('Error deleting banner:', err);
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
      <BannerForm
        banner={currentBanner}
        onSave={handleSaveBanner}
        onCancel={handleCancelForm}
      />
    );
  }

  // Default list view - show content even if loading
  return (
    <div>
      <BannerHeader />

      <BannerFilters
        filters={{ status, search }}
        onFilterChange={updateFilters}
      />

      <BannerList
        banners={banners}
        filters={{ status, search }}
        meta={meta}
        page={page}
        setPage={setPage}
        loading={loading}
        onEdit={handleEditBanner}
        onDelete={handleDeleteBanner}
        onAddBanner={handleAddBanner}
      />
    </div>
  );
};

export default BannerContainer;