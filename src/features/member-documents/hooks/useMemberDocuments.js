import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../../shared/context/AppContext';
import memberDocumentsService from '../services';

export const useMemberDocuments = (memberId) => {
  const { addLog, addToast } = useContext(AppContext);

  const [memberData, setMemberData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMemberDocuments = async () => {
    if (!memberId) return;

    try {
      setLoading(true);
      
      const [memberResponse, documentsResponse] = await Promise.all([
        memberDocumentsService.getMemberValidationData(memberId),
        memberDocumentsService.getMemberDocuments(memberId)
      ]);

      setMemberData(memberResponse);
      setDocuments(documentsResponse.documents || []);
      addLog(`Documentos del socio cargados: ${documentsResponse.documents?.length || 0}`);
    } catch (error) {
      console.error('Error loading member documents:', error);
      addToast('Error al cargar los documentos del socio', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateDocumentStatus = async (documentId, newStatus, notes = null) => {
    try {
      await memberDocumentsService.updateDocumentStatus(documentId, newStatus, notes);
      addLog(`Estado de documento actualizado: ${memberDocumentsService.formatStatus(newStatus)}`);
      addToast('Estado actualizado correctamente', 'success');
      
      await loadMemberDocuments();
      return true;
    } catch (error) {
      console.error('Error updating document status:', error);
      addToast('Error al actualizar el estado', 'error');
      return false;
    }
  };

  const updateValidationStatus = async (validationId, newStatus, rejectionReason = null) => {
    try {
      await memberDocumentsService.updateValidationStatus(validationId, newStatus, rejectionReason);
      addLog(`Estado de validación actualizado: ${memberDocumentsService.formatStatus(newStatus)}`);
      addToast('Validación actualizada correctamente', 'success');
      
      await loadMemberDocuments();
      return true;
    } catch (error) {
      console.error('Error updating validation status:', error);
      addToast('Error al actualizar la validación', 'error');
      return false;
    }
  };

  useEffect(() => {
    loadMemberDocuments();
  }, [memberId]);

  return {
    memberData,
    documents,
    loading,
    loadMemberDocuments,
    updateDocumentStatus,
    updateValidationStatus,
    formatStatus: memberDocumentsService.formatStatus,
    getStatusBadge: memberDocumentsService.getStatusBadge
  };
};
