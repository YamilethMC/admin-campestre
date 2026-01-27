import React from 'react';

const DocumentFormModal = ({ 
  show, 
  editingDocument, 
  formData, 
  onChange, 
  onSubmit, 
  onClose 
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {editingDocument ? 'Editar Documento' : 'Nuevo Documento'}
        </h3>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código *
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: INE"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del documento *
            </label>
            <input
              type="text"
              name="label"
              value={formData.label}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Identificación oficial (INE/IFE)"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción detallada del documento..."
            />
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-md p-3 text-sm text-blue-800">
              Los formatos aceptados se manejan automáticamente (pdf, jpg, jpeg, png) y no son editables.
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tamaño máximo (MB) *
              </label>
              <input
                type="number"
                name="maxSizeMB"
                value={formData.maxSizeMB}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                min="1"
                max="100"
                step="0.1"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="required"
                checked={formData.required}
                onChange={onChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Documento requerido</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={onChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Activo</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md"
            >
              {editingDocument ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentFormModal;
