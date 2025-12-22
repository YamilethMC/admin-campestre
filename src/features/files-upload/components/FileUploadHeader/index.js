const FileUploadHeader = () => {
  return (
    <div className="bg-gradient-to-r from-primary to-primary-light rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center">
        <div className="p-3 bg-green bg-opacity-20 rounded-xl backdrop-blur-sm mr-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Cargar documento</h1>
          <p className="text-white text-opacity-90">
            Carga documentos para mostrarlos en la app del socio
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUploadHeader;
