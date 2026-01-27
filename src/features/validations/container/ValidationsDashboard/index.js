import React, { useState, useEffect } from 'react';
import { useValidation } from '../../hooks/useValidation';
import StatsCards from '../../components/StatsCards';
import FiltersBar from '../../components/FiltersBar';
import ValidationTable from '../../components/ValidationTable';
import MemberValidationDetail from '../../components/MemberValidationDetail';

const ValidationsDashboard = () => {
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  const {
    validations,
    stats,
    filters,
    loadingValidations,
    loadValidations,
    loadValidationDetails,
    updateValidationStatus,
    applyFilters,
    clearFilters,
    formatStatus,
    getStatusBadge
  } = useValidation();

  useEffect(() => {
    loadValidations();
  }, []);

  const handleFilterChange = (filterType, value) => {
    applyFilters({ [filterType]: value });
  };

  const handleViewDetails = (memberId) => {
    setSelectedMemberId(memberId);
  };

  const handleBackToList = () => {
    setSelectedMemberId(null);
    loadValidations();
  };

  if (loadingValidations) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (selectedMemberId) {
    return (
      <MemberValidationDetail
        memberId={selectedMemberId}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Validaciones</h1>
            <p className="text-gray-600">Gestión de validaciones de documentos</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">

      {/* <StatsCards stats={stats} /> */}

      <FiltersBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />

      <ValidationTable
        validations={validations}
        getStatusBadge={getStatusBadge}
        formatStatus={formatStatus}
        onViewDetails={handleViewDetails}
        onApprove={() => {}}
        onReject={() => {}}
      />
      </div>
    </div>
  );
};

export default ValidationsDashboard;
