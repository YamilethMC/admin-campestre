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
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel de Validaciones</h1>
          <p className="text-gray-600">Gestiona las validaciones de documentos de los socios</p>
        </div>
      </div>

      <StatsCards stats={stats} />

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
  );
};

export default ValidationsDashboard;
