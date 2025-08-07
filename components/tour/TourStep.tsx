// /components/tour/TourStep.tsx

'use client'

import { motion } from 'framer-motion'
import { TourStep as TourStepType } from '@/data/tour'

interface TourStepProps {
  step: TourStepType
  isActive: boolean
}

export default function TourStep({ step, isActive }: TourStepProps) {
  if (!isActive) return null

  const Icon = step.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex flex-col items-center text-center"
    >
      {/* Icon with background */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className={`mb-6 flex h-24 w-24 items-center justify-center rounded-full ${step.iconBg}`}
      >
        <Icon className="h-10 w-10 text-blue-600" />
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-3 text-2xl font-bold text-gray-900"
      >
        {step.title}
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mb-4 text-base text-gray-600"
      >
        {step.subtitle}
      </motion.p>

      {/* Description */}
      {step.description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6 max-w-md text-sm text-gray-500"
        >
          {step.description}
        </motion.p>
      )}

      {/* Features (for step 1) */}
      {step.features && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mb-6 flex gap-8"
        >
          {step.features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-lg bg-gray-50">
                {feature.icon ? (
                  <feature.icon className="h-8 w-8 text-gray-600" />
                ) : (
                  <div className="h-8 w-8 rounded bg-gray-300" />
                )}
              </div>
              <span className="text-sm text-gray-600">{feature.label}</span>
            </div>
          ))}
        </motion.div>
      )}

      {/* Highlights */}
      {step.highlights && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="w-full max-w-sm space-y-3"
        >
          {step.highlights.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
            >
              <span className="text-sm font-medium text-gray-700">
                {highlight.label}
              </span>
              <span className={`text-sm font-semibold ${highlight.color || 'text-gray-900'}`}>
                {highlight.value}
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}