// /app/onboarding/components/shared/FileUpload.tsx

'use client'

import { useState, useRef } from 'react'
import { Upload, X, Check, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface FileUploadProps {
  label: string
  accept?: string
  maxSize?: number // in MB
  value?: File | null
  previewUrl?: string
  onFileSelect: (file: File | null) => void
  onUploadComplete?: (url: string) => void
  disabled?: boolean
  required?: boolean
  error?: string
  helperText?: string
  isVerified?: boolean
  isVerifying?: boolean
}

export default function FileUpload({
  label,
  accept = 'image/png,image/jpeg,image/jpg',
  maxSize = 5,
  value,
  previewUrl,
  onFileSelect,
  onUploadComplete,
  disabled = false,
  required = false,
  error,
  helperText,
  isVerified = false,
  isVerifying = false
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`)
      return
    }

    // Validate file type
    const fileType = file.type
    const acceptedTypes = accept.split(',').map(type => type.trim())
    if (!acceptedTypes.some(type => fileType.match(type))) {
      toast.error('Invalid file type. Please upload PNG or JPG only.')
      return
    }

    setIsUploading(true)
    onFileSelect(file)

    // Simulate upload delay
    setTimeout(() => {
      const url = URL.createObjectURL(file)
      if (onUploadComplete) {
        onUploadComplete(url)
      }
      setIsUploading(false)
    }, 1500)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (disabled || isUploading) return

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled && !isUploading) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleRemove = () => {
    onFileSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Upload Area */}
      {!value && !previewUrl ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative rounded-lg border-2 border-dashed p-6
            transition-all duration-200
            ${isDragging 
              ? 'border-blue-400 bg-blue-50' 
              : error
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
            }
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileInput}
            disabled={disabled || isUploading}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center">
            {isUploading ? (
              <>
                <Loader2 className="mb-3 h-10 w-10 animate-spin text-blue-600" />
                <p className="text-sm font-medium text-gray-700">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="mb-3 h-10 w-10 text-gray-400" />
                <p className="mb-1 text-sm font-medium text-gray-700">
                  Drop your file here, or{' '}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 hover:text-blue-700"
                    disabled={disabled}
                  >
                    browse
                  </button>
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG up to {maxSize}MB
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        /* Preview Area */
        <div className="relative rounded-lg border border-gray-300 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Preview Thumbnail */}
              {previewUrl && (
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded border border-gray-200">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {/* File Info */}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {value?.name || 'Uploaded file'}
                </p>
                {value && (
                  <p className="text-xs text-gray-500">
                    {(value.size / 1024).toFixed(1)} KB
                  </p>
                )}
                
                {/* Verification Status */}
                {isVerifying && (
                  <div className="mt-1 flex items-center text-xs text-blue-600">
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Verifying...
                  </div>
                )}
                {isVerified && (
                  <div className="mt-1 flex items-center text-xs text-green-600">
                    <Check className="mr-1 h-3 w-3" />
                    Verified
                  </div>
                )}
              </div>
            </div>

            {/* Remove Button */}
            {!disabled && !isUploading && !isVerifying && (
              <button
                type="button"
                onClick={handleRemove}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Helper Text or Error */}
      {error && (
        <p className="flex items-center text-xs text-red-600">
          <AlertCircle className="mr-1 h-3 w-3" />
          {error}
        </p>
      )}
      {!error && helperText && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}

      {/* Alternative Upload Button (if file exists) */}
      {value && !disabled && !isUploading && !isVerifying && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="mt-2"
        >
          Choose Different File
        </Button>
      )}
    </div>
  )
}