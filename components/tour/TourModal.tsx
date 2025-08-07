// /components/tour/TourModal.tsx

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useSwipeable } from 'react-swipeable'
import TourProgress from './TourProgress'
import TourStep from './TourStep'
import { tourSteps } from '@/data/tour'

interface TourModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TourModal({ isOpen, onClose }: TourModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [showConfirmSkip, setShowConfirmSkip] = useState(false)
  const router = useRouter()
  const totalSteps = tourSteps.length

  // Swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrevious(),
    preventScrollOnSwipe: true,
    trackMouse: false,
    trackTouch: true,
  })

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          handleClose()
          break
        case 'ArrowLeft':
          handlePrevious()
          break
        case 'ArrowRight':
          if (currentStep < totalSteps) handleNext()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentStep])

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else if (currentStep === totalSteps) {
      // Last step - go to onboarding
      completeTour()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkipTour = () => {
    setShowConfirmSkip(true)
  }

  const confirmSkip = () => {
    localStorage.setItem('hasSeenTour', 'true')
    toast.info('Tour skipped. Starting onboarding...')
    router.push('/onboarding')
    onClose()
  }

  const cancelSkip = () => {
    setShowConfirmSkip(false)
  }

  const handleClose = () => {
    setShowConfirmSkip(true)
  }

  const completeTour = () => {
    localStorage.setItem('hasSeenTour', 'true')
    toast.success('Tour completed! Let\'s set up your account.')
    router.push('/onboarding')
    onClose()
  }

  if (!isOpen) return null

  const currentTourStep = tourSteps[currentStep - 1]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              {...swipeHandlers}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8 md:p-10"
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Progress Bar */}
              <TourProgress currentStep={currentStep} totalSteps={totalSteps} />

              {/* Step Content */}
              <div className="mb-8 min-h-[350px]">
                <AnimatePresence mode="wait">
                  <TourStep
                    key={currentStep}
                    step={currentTourStep}
                    isActive={true}
                  />
                </AnimatePresence>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between">
                {/* Previous Button */}
                <Button
                  variant="ghost"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 ${
                    currentStep === 1 ? 'invisible' : ''
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                {/* Skip Tour (middle) */}
                {currentTourStep.showSkip && (
                  <button
                    onClick={handleSkipTour}
                    className="text-sm text-gray-500 underline-offset-2 hover:text-gray-700 hover:underline"
                  >
                    Skip Tour
                  </button>
                )}

                {/* Next/Get Started Button */}
                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  {currentTourStep.nextButtonText}
                  {currentStep < totalSteps && <ChevronRight className="h-4 w-4" />}
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Skip Confirmation Modal */}
          <AnimatePresence>
            {showConfirmSkip && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[60] bg-black/20"
                  onClick={cancelSkip}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed left-1/2 top-1/2 z-[61] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl"
                >
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">
                    Skip the tour?
                  </h3>
                  <p className="mb-6 text-sm text-gray-600">
                    Are you sure you want to skip the tour? You can always access help from the dashboard later.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={cancelSkip}
                      className="flex-1"
                    >
                      Continue Tour
                    </Button>
                    <Button
                      onClick={confirmSkip}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      Skip & Continue
                    </Button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  )
}