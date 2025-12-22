import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../../shared/context/AppContext';
import { legalService } from '../services/legalService';

const LegalDocumentManager = () => {
  const { addToast, addLog } = useContext(AppContext);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewDocModal, setShowNewDocModal] = useState(false);
  const [showNewVersionModal, setShowNewVersionModal] = useState(false);
  const [showAcceptancesModal, setShowAcceptancesModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [acceptances, setAcceptances] = useState([]);

  const [newDocument, setNewDocument] = useState({
    slug: '',
    title: '',
  });

  const [newVersion, setNewVersion] = useState({
    version: '',
    content: '',
  });

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    const result = await legalService.getAllDocuments();

    if (result.success) {
      // Ensure data is always an array
      const documentsData = Array.isArray(result.data) ? result.data : [];
      setDocuments(documentsData);
      addLog('Documentos legales cargados correctamente');
    } else {
      addToast(result.error, 'error');
      setDocuments([]); // Set empty array on error
    }

    setLoading(false);
  };

  const handleCreateDocument = async e => {
    e.preventDefault();

    const result = await legalService.createDocument(newDocument);

    if (result.success) {
      addToast('Documento creado exitosamente', 'success');
      addLog(`Documento legal creado: ${newDocument.title}`);
      setShowNewDocModal(false);
      setNewDocument({ slug: '', title: '' });
      loadDocuments();
    } else {
      addToast(result.error, 'error');
    }
  };

  const handleCreateVersion = async e => {
    e.preventDefault();

    const result = await legalService.createVersion(selectedDocument.id, newVersion);

    if (result.success) {
      addToast('Versión creada exitosamente', 'success');
      addLog(`Nueva versión creada para: ${selectedDocument.title}`);
      setShowNewVersionModal(false);
      setNewVersion({ version: '', content: '' });
      setSelectedDocument(null);
      loadDocuments();
    } else {
      addToast(result.error, 'error');
    }
  };

  const handlePublishVersion = async (versionId, documentTitle) => {
    if (
      !window.confirm('¿Estás seguro de publicar esta versión? Esto archivará la versión anterior.')
    ) {
      return;
    }

    const result = await legalService.publishVersion(versionId);

    if (result.success) {
      addToast('Versión publicada exitosamente', 'success');
      addLog(`Versión publicada para: ${documentTitle}`);
      loadDocuments();
    } else {
      addToast(result.error, 'error');
    }
  };

  const handleViewAcceptances = async version => {
    setSelectedVersion(version);
    const result = await legalService.getVersionAcceptances(version.id);

    if (result.success) {
      setAcceptances(result.data);
      setShowAcceptancesModal(true);
    } else {
      addToast(result.error, 'error');
    }
  };

  const getStatusBadge = status => {
    const badges = {
      DRAFT: 'bg-gray-500',
      PUBLISHED: 'bg-primary',
      ARCHIVED: 'bg-yellow-600',
    };

    const labels = {
      DRAFT: 'Borrador',
      PUBLISHED: 'Publicado',
      ARCHIVED: 'Archivado',
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold text-white rounded ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Documentos Legales</h1>
        <button
          onClick={() => setShowNewDocModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-all shadow-sm hover:shadow-md font-medium"
        >
          Nuevo Documento
        </button>
      </div>

      <div className="space-y-6">
        {documents.map(doc => (
          <div key={doc.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{doc.title}</h2>
                <p className="text-sm text-gray-500">Slug: {doc.slug}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedDocument(doc);
                  setShowNewVersionModal(true);
                }}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
              >
                Nueva Versión
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">Versiones:</h3>
              {doc.versions.length === 0 ? (
                <p className="text-sm text-gray-500">No hay versiones disponibles</p>
              ) : (
                doc.versions.map(version => (
                  <div
                    key={version.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">v{version.version}</span>
                        {getStatusBadge(version.status)}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {version.publishedAt
                          ? `Publicado: ${new Date(version.publishedAt).toLocaleString()}`
                          : `Creado: ${new Date(version.createdAt).toLocaleString()}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {version.status === 'DRAFT' && (
                        <button
                          onClick={() => handlePublishVersion(version.id, doc.title)}
                          className="bg-primary text-white px-3 py-1 rounded-lg text-sm hover:bg-primary-dark transition-all shadow-sm hover:shadow font-medium"
                        >
                          Publicar
                        </button>
                      )}
                      {version.status === 'PUBLISHED' && (
                        <button
                          onClick={() => handleViewAcceptances(version)}
                          className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition"
                        >
                          Ver Aceptaciones
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {showNewDocModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nuevo Documento Legal</h2>
            <form onSubmit={handleCreateDocument}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={newDocument.title}
                  onChange={e => setNewDocument({ ...newDocument, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL amigable)
                </label>
                <input
                  type="text"
                  value={newDocument.slug}
                  onChange={e => setNewDocument({ ...newDocument, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="terminos-y-condiciones"
                  pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Solo minúsculas, números y guiones</p>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewDocModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all shadow-sm hover:shadow-md font-medium"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showNewVersionModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Nueva Versión: {selectedDocument.title}</h2>
            <form onSubmit={handleCreateVersion}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Versión
                </label>
                <input
                  type="text"
                  value={newVersion.version}
                  onChange={e => setNewVersion({ ...newVersion, version: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="1.0.0"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenido (Markdown/HTML)
                </label>
                <textarea
                  value={newVersion.content}
                  onChange={e => setNewVersion({ ...newVersion, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="12"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewVersionModal(false);
                    setSelectedDocument(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all shadow-sm hover:shadow-md font-medium"
                >
                  Crear Versión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAcceptancesModal && selectedVersion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              Registro de Aceptaciones - v{selectedVersion.version}
            </h2>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Total de aceptaciones: {acceptances.length}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                      Usuario
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Fecha</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">IP</th>
                  </tr>
                </thead>
                <tbody>
                  {acceptances.map(acceptance => (
                    <tr key={acceptance.id} className="border-b">
                      <td className="px-4 py-2 text-sm">
                        {acceptance.user.name} {acceptance.user.lastName}
                      </td>
                      <td className="px-4 py-2 text-sm">{acceptance.user.email}</td>
                      <td className="px-4 py-2 text-sm">
                        {new Date(acceptance.acceptedAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-sm">{acceptance.ipAddress || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setShowAcceptancesModal(false);
                  setSelectedVersion(null);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LegalDocumentManager;
