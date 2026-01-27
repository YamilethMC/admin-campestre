import api from '../../../shared/api/api';

class ValidationService {
  async getValidations(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      
      const response = await api.get(`/admin/validation?${params.toString()}`);
      const payload = response.data?.data ?? {};
      return {
        data: payload.data ?? [],
        meta: payload.meta ?? {},
      };
    } catch (error) {
      console.error('Error fetching validations:', error);
      throw error;
    }
  }

  async getValidationDetails(validationId) {
    try {
      const response = await api.get(`/admin/validation/${validationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching validation details:', error);
      throw error;
    }
  }

  async updateValidationStatus(validationId, status, rejectionReason = null) {
    try {
      const payload = { status };
      if (rejectionReason) payload.rejectionReason = rejectionReason;
      
      const response = await api.patch(`/admin/validation/${validationId}/status`, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating validation status:', error);
      throw error;
    }
  }

  async updateDocumentStatus(documentId, payload) {
    try {
      const response = await api.patch(`/admin/validation/documents/${documentId}/status`, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating document status:', error);
      throw error;
    }
  }

  async getValidationReports() {
    try {
      const response = await api.get('/admin/validation/reports');
      return response.data;
    } catch (error) {
      console.error('Error fetching validation reports:', error);
      throw error;
    }
  }

  async getDocumentCatalog(activeOnly = false) {
    try {
      const params = activeOnly ? '?activeOnly=true' : '';
      const response = await api.get(`/admin/validation/catalog${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching document catalog:', error);
      throw error;
    }
  }

  async createDocumentCatalog(documentData) {
    try {
      const response = await api.post('/admin/validation/catalog', documentData);
      return response.data;
    } catch (error) {
      console.error('Error creating document catalog:', error);
      throw error;
    }
  }

  async updateDocumentCatalog(catalogId, documentData) {
    try {
      const response = await api.patch(`/admin/validation/catalog/${catalogId}`, documentData);
      return response.data;
    } catch (error) {
      console.error('Error updating document catalog:', error);
      throw error;
    }
  }

  async deleteDocumentCatalog(catalogId) {
    try {
      const response = await api.del(`/admin/validation/catalog/${catalogId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting document catalog:', error);
      throw error;
    }
  }

  async getMemberValidationData(memberId) {
    try {
      const response = await api.get(`/admin/validation/member/${memberId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching member validation data:', error);
      throw error;
    }
  }

  async getMemberDocuments(memberId) {
    try {
      const response = await api.get(`/admin/validation/member/${memberId}/documents`);
      return response.data;
    } catch (error) {
      console.error('Error fetching member documents:', error);
      throw error;
    }
  }

  async getQuickStats() {
    try {
      const reports = await this.getValidationReports();
      return {
        total: reports.totalValidations || 0,
        pending: reports.pendingValidations || 0,
        approved: reports.approvedValidations || 0,
        rejected: reports.rejectedValidations || 0,
        inReview: reports.inReviewValidations || 0
      };
    } catch (error) {
      console.error('Error fetching quick stats:', error);
      return {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        inReview: 0
      };
    }
  }

  formatStatus(status) {
    const statusMap = {
      'NOT_STARTED': 'No iniciado',
      'PARTIAL': 'Parcial',
      'IN_REVIEW': 'En revisión',
      'APPROVED': 'Aprobado',
      'REJECTED': 'Rechazado',
      'PENDING': 'Pendiente',
      'UPLOADED': 'Subido',
      'VALIDATED': 'Validado'
    };
    return statusMap[status] || status;
  }

  getStatusColor(status) {
    const colorMap = {
      'NOT_STARTED': 'text-gray-500',
      'PARTIAL': 'text-yellow-600',
      'IN_REVIEW': 'text-blue-600',
      'APPROVED': 'text-green-600',
      'REJECTED': 'text-red-600',
      'PENDING': 'text-gray-500',
      'UPLOADED': 'text-blue-600',
      'VALIDATED': 'text-green-600'
    };
    return colorMap[status] || 'text-gray-500';
  }

  getStatusBadge(status) {
    const badgeMap = {
      'NOT_STARTED': 'bg-gray-100 text-gray-800',
      'PARTIAL': 'bg-yellow-100 text-yellow-800',
      'IN_REVIEW': 'bg-blue-100 text-blue-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'PENDING': 'bg-gray-100 text-gray-800',
      'UPLOADED': 'bg-blue-100 text-blue-800',
      'VALIDATED': 'bg-green-100 text-green-800'
    };
    return badgeMap[status] || 'bg-gray-100 text-gray-800';
  }
}

const validationService = new ValidationService();
export default validationService;
