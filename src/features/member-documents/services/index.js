import api from '../../../shared/api/api';
import { handleAuthError } from '../../../shared/utils/authErrorHandler';

class MemberDocumentsService {
  async getMemberValidationData(memberId) {
    try {
      const response = await api.get(`/admin/validation/member/${memberId}`);

      if (!response.ok) {
        // Verificar si es un error de autenticación
        if (response.status === 401) {
          // Llamar a la función global para manejar el error de autenticación
          handleAuthError();
          return {
            success: false,
            error: 'No autorizado: Sesión expirada',
            status: response.status
          };
        }

        let errorMessage = 'Error al cargar las validaciones del miembro';

        // Manejar códigos de error específicos en el servicio
        switch (response.status) {
          case 401:
            errorMessage = 'No autorizado: Por favor inicia sesión para continuar';
            break;
          case 404:
            errorMessage = 'Validaciones del miembro no encontradas';
            break;
          case 500:
            errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
            break;
          default:
            const errorText = await response.text().catch(() => '');
            errorMessage = `Error en la solicitud: ${response.status}. Detalles: ${errorText}`;
        }

        return {
          success: false,
          error: errorMessage,
          status: response.status
        };
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching member validation data:', error);
    }
  }

  async getMemberDocuments(memberId) {
    try {
      const response = await api.get(`/admin/validation/member/${memberId}/documents`);

      if (!response.ok) {
        // Verificar si es un error de autenticación
        if (response.status === 401) {
          // Llamar a la función global para manejar el error de autenticación
          handleAuthError();
          return {
            success: false,
            error: 'No autorizado: Sesión expirada',
            status: response.status
          };
        }

        let errorMessage = 'Error al cargar los documentos del miembro';

        // Manejar códigos de error específicos en el servicio
        switch (response.status) {
          case 401:
            errorMessage = 'No autorizado: Por favor inicia sesión para continuar';
            break;
          case 404:
            errorMessage = 'Documentos del miembro no encontrados';
            break;
          case 500:
            errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
            break;
          default:
            const errorText = await response.text().catch(() => '');
            errorMessage = `Error en la solicitud: ${response.status}. Detalles: ${errorText}`;
        }

        return {
          success: false,
          error: errorMessage,
          status: response.status
        };
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching member documents:', error);

    }
  }

  async updateDocumentStatus(documentId, status, notes = null) {
    try {
      const payload = { status };
      if (notes) payload.notes = notes;
      
      const response = await api.patch(`/admin/validation/documents/${documentId}/status`, payload);

      if (!response.ok) {
        // Verificar si es un error de autenticación
        if (response.status === 401) {
          // Llamar a la función global para manejar el error de autenticación
          handleAuthError();
          return {
            success: false,
            error: 'No autorizado: Sesión expirada',
            status: response.status
          };
        }

        let errorMessage = 'Error al actualizar el estado del documento';

        // Manejar códigos de error específicos en el servicio
        switch (response.status) {
          case 401:
            errorMessage = 'No autorizado: Por favor inicia sesión para continuar';
            break;
          case 404:
            errorMessage = 'Documentos no encontrados';
            break;
          case 500:
            errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
            break;
          default:
            const errorText = await response.text().catch(() => '');
            errorMessage = `Error en la solicitud: ${response.status}. Detalles: ${errorText}`;
        }

        return {
          success: false,
          error: errorMessage,
          status: response.status
        };
      }

      return response.data;
    } catch (error) {
      console.error('Error updating document status:', error);
    }
  }

  async updateValidationStatus(validationId, status, rejectionReason = null) {
    try {
      const payload = { status };
      if (rejectionReason) payload.rejectionReason = rejectionReason;
      
      const response = await api.patch(`/admin/validation/${validationId}/status`, payload);

      if (!response.ok) {
        // Verificar si es un error de autenticación
        if (response.status === 401) {
          // Llamar a la función global para manejar el error de autenticación
          handleAuthError();
          return {
            success: false,
            error: 'No autorizado: Sesión expirada',
            status: response.status
          };
        }

        let errorMessage = 'Error al actualizar el estado de la validación';

        // Manejar códigos de error específicos en el servicio
        switch (response.status) {
          case 401:
            errorMessage = 'No autorizado: Por favor inicia sesión para continuar';
            break;
          case 404:
            errorMessage = 'Validación no encontrada';
            break;
          case 500:
            errorMessage = 'Error interno del servidor: Por favor intenta más tarde';
            break;
          default:
            const errorText = await response.text().catch(() => '');
            errorMessage = `Error en la solicitud: ${response.status}. Detalles: ${errorText}`;
        }

        return {
          success: false,
          error: errorMessage,
          status: response.status
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Error updating validation status:', error);
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
