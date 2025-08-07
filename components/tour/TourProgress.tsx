// /components/tour/TourProgress.tsx

'use client'

import { motion } from 'framer-motion'

interface TourProgressProps {
  currentStep: number
  totalSteps: number
}

export default function TourProgress({ currentStep, totalSteps }: TourProgressProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="mb-8">
      {/* Step indicator text */}
      <div className="mb-3 text-sm font-medium text-gray-600">
        Step {currentStep} of {totalSteps}
      </div>
      
      {/* Progress bar container */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
        {/* Animated progress fill */}
        <motion.div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{
            duration: 0.5,
            ease: "easeInOut"
          }}
        />
        
        {/* Progress dots */}
        <div className="absolute inset-0 flex items-center justify-between px-1">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                i < currentStep
                  ? 'bg-white shadow-sm'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Progress percentage (optional, hidden on mobile) */}
      <div className="mt-2 hidden text-xs text-gray-500 sm:block">
        {Math.round(progress)}% Complete
      </div>
    </div>
  )
}