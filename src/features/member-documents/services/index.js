import api from '../../../shared/api/api';

class MemberDocumentsService {
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

  async updateDocumentStatus(documentId, status, notes = null) {
    try {
      const payload = { status };
      if (notes) payload.notes = notes;
      
      const response = await api.patch(`/admin/validation/documents/${documentId}/status`, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating document status:', error);
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

const memberDocumentsService = new MemberDocumentsService();
export default memberDocumentsService;
