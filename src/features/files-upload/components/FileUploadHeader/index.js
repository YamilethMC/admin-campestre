
const FileUploadHeader = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Cargar Archivos</h1>
            <p className="text-gray-600">Carga de documentos para la app</p>
          </div>
        </div>
      </div>
  );
};

export default FileUploadHeader;