import api from '../../../shared/api/api';
import { handleAuthError } from '../../../shared/utils/authErrorHandler';

class DocumentCatalogService {
  async getDocumentCatalog(activeOnly = false) {
    try {
      const params = activeOnly ? '?activeOnly=true' : '';
      const response = await api.get(`/admin/validation/catalog${params}`);

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

        let errorMessage = 'Error al cargar los catálogos de documentos';

        // Manejar códigos de error específicos en el servicio
        switch (response.status) {
          case 401:
            errorMessage = 'No autorizado: Por favor inicia sesión para continuar';
            break;
          case 404:
            errorMessage = 'Catálogos de documentos no encontrados';
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
      console.error('Error fetching document catalog:', error);
    }
  }

  async createDocumentCatalog(documentData) {
    try {
      const response = await api.post('/admin/validation/catalog', documentData);

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

        let errorMessage = 'Error al crear el catálogo de documentos';

        // Manejar códigos de error específicos en el servicio
        switch (response.status) {
          case 401:
            errorMessage = 'No autorizado: Por favor inicia sesión para continuar';
            break;
          case 404:
            errorMessage = 'Catálogos de documentos no encontrados';
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
      console.error('Error creating document catalog:', error);
    }
  }

  async updateDocumentCatalog(catalogId, documentData) {
    try {
      const response = await api.patch(`/admin/validation/catalog/${catalogId}`, documentData);

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

        let errorMessage = 'Error al actualizar el catálogo de documentos';

        // Manejar códigos de error específicos en el servicio
        switch (response.status) {
          case 401:
            errorMessage = 'No autorizado: Por favor inicia sesión para continuar';
            break;
          case 404:
            errorMessage = 'Catálogos de documentos no encontrados';
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
      console.error('Error updating document catalog:', error);
    }
  }

  async deleteDocumentCatalog(catalogId) {
    try {
      const response = await api.del(`/admin/validation/catalog/${catalogId}`);

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

        let errorMessage = 'Error al eliminar el catálogo de documentos';

        // Manejar códigos de error específicos en el servicio
        switch (response.status) {
          case 401:
            errorMessage = 'No autorizado: Por favor inicia sesión para continuar';
            break;
          case 404:
            errorMessage = 'Catálogos de documentos no encontrados';
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
      console.error('Error deleting document catalog:', error);
    }
  }
}

const documentCatalogService = new DocumentCatalogService();
export default documentCatalogService;
