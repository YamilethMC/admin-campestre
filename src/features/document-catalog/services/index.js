import api from '../../../shared/api/api';

class DocumentCatalogService {
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
}

const documentCatalogService = new DocumentCatalogService();
export default documentCatalogService;
