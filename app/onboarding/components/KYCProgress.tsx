import React from 'react';

interface KYCProgressProps {
  currentStep: number;
  completedSteps: number[];
}

const KYCProgress: React.FC<KYCProgressProps> = ({ currentStep, completedSteps }) => {
  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'PAN' },
    { number: 3, title: 'Photo' },
    { number: 4, title: 'Bank' }
  ];

  const totalSteps = steps.length;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const isStepCompleted = (stepNumber: number) => completedSteps.includes(stepNumber);
  const isStepActive = (stepNumber: number) => stepNumber === currentStep;

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-xs text-gray-500">
          {Math.round(progressPercentage)}%
        </span>
      </div>

      {/* Compact Progress Bar and Steps */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0">
          <div 
            className="h-full bg-blue-900 transition-all duration-300 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Compact Steps */}
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const completed = isStepCompleted(step.number);
            const active = isStepActive(step.number);

            return (
              <div 
                key={step.number} 
                className="flex flex-col items-center"
              >
                {/* Smaller Step Circle */}
                <div
                  className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center font-medium text-xs transition-all duration-200 ${
                    completed
                      ? 'bg-blue-900 border-blue-500 text-white'
                      : active
                      ? 'bg-blue-800 border-blue-500 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {completed ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>

                {/* Compact Step Label */}
                <div className="mt-2 text-center">
                  <div className={`text-xs font-medium transition-colors duration-200 ${
                    active ? 'text-blue-900' : completed ? 'text-gray-700' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KYCProgress;