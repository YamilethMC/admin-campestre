const BannerHeader = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div>
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M5.455 19h13.09c1.52 0 2.48-1.64 1.7-3L13.7 4c-.77-1.36-2.63-1.36-3.4 0L3.755 16c-.78 1.36.18 3 1.7 3z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Banners</h1>
            <p className="text-gray-600">
              Gestiona los banners para promociones e información importante
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerHeader;
