import React from 'react';

const StepIndicator = ({ currentStep, steps }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  index + 1 < currentStep
                    ? 'bg-green-500 text-white'
                    : index + 1 === currentStep
                    ? 'bg-primary text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {index + 1 < currentStep ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={`text-sm font-medium ${
                    index + 1 === currentStep ? 'text-primary' : 'text-gray-600'
                  }`}
                >
                  {step.title}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 transition-colors ${
                  index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-300'
                }`}
                style={{ maxWidth: '100px' }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
