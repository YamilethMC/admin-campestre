import React, { useState, useEffect } from 'react';
import { useDocumentCatalog } from '../../hooks/useDocumentCatalog';
import CatalogStats from '../../components/CatalogStats';
import CatalogTable from '../../components/CatalogTable';
import DocumentFormModal from '../../components/DocumentFormModal';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';

const DocumentCatalog = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  const {
    catalog,
    formData,
    loadingCatalog,
    loadCatalog,
    deleteDocument,
    toggleDocumentStatus,
    loadDocumentForEdit,
    resetForm,
    handleChange,
    handleSubmit,
  } = useDocumentCatalog();

  useEffect(() => {
    loadCatalog();
  }, []);

  const handleEditDocument = (document) => {
    setEditingDocument(document);
    loadDocumentForEdit(document);
    setShowModal(true);
  };

  const handleNewDocument = () => {
    setEditingDocument(null);
    resetForm();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDocument(null);
    resetForm();
  };

  const handleFormSubmit = async (e) => {
    const success = await handleSubmit(e, editingDocument?.id);
    if (success) {
      handleCloseModal();
    }
  };

  const handleDeleteClick = (document) => {
    setDocumentToDelete(document);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (documentToDelete) {
      const success = await deleteDocument(documentToDelete.id, documentToDelete.label);
      if (success) {
        setShowDeleteConfirm(false);
        setDocumentToDelete(null);
      }
    }
  };

  const handleStatusToggle = async (document) => {
    await toggleDocumentStatus(document.id, document.active);
  };

  if (loadingCatalog) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catálogo de Documentos</h1>
          <p className="text-gray-600">Gestiona los tipos de documentos requeridos para validación</p>
        </div>
        <button
          onClick={handleNewDocument}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Agregar Documento
        </button>
      </div>

      <CatalogStats catalog={catalog} />

      <CatalogTable
        catalog={catalog}
        onEdit={handleEditDocument}
        onDelete={handleDeleteClick}
        onToggleStatus={handleStatusToggle}
      />

      <DocumentFormModal
        show={showModal}
        editingDocument={editingDocument}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleFormSubmit}
        onClose={handleCloseModal}
      />

      <DeleteConfirmModal
        show={showDeleteConfirm}
        document={documentToDelete}
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setDocumentToDelete(null);
        }}
      />
    </div>
  );
};

export default DocumentCatalog;
