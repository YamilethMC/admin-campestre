const SurveyHeader = ({ activeCount, inactiveCount }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div>
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Encuestas</h1>
            <p className="text-gray-600">Administración de encuestas</p>
          </div>
        </div>
        
        {/*<div className="flex space-x-6">
          <div className="text-center min-w-[80px]">
            <div className="text-3xl font-bold text-gray-800">{activeCount}</div>
            <div className="text-sm text-gray-600">Activas</div>
          </div>
          <div className="text-center min-w-[80px]">
            <div className="text-3xl font-bold text-gray-800">{inactiveCount}</div>
            <div className="text-sm text-gray-600">Inactivas</div>
          </div>
        </div>*/}
      </div>
    </div>
  );
};

export default SurveyHeader;