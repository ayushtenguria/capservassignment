// /app/onboarding/components/steps/BasicInfoStep.tsx

'use client'

import { useState } from 'react'
import { User, Calendar, Phone, MapPin, CalendarIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { KYCData, ValidationErrors } from '@/types/types'

interface BasicInfoStepProps {
  data: KYCData
  errors: ValidationErrors
  onChange: (field: keyof KYCData, value: any) => void
  onValidate: (field: keyof KYCData) => void
}

export default function BasicInfoStep({
  data,
  errors,
  onChange,
  onValidate
}: BasicInfoStepProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  // Mark field as touched and trigger validation on blur
  const handleBlur = (field: keyof KYCData) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    onValidate(field)
  }

  // Handle date selection from calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Format date as dd-mm-yyyy for display and storage
      const formattedDate = format(date, 'dd-MM-yyyy')
      onChange('dateOfBirth', formattedDate)
      setTouched(prev => ({ ...prev, dateOfBirth: true }))
      onValidate('dateOfBirth')
      setDatePickerOpen(false)
    }
  }

  // Parse the current date string to Date object for calendar
  const parseDate = (dateString: string): Date | undefined => {
    if (!dateString || dateString.length < 10) return undefined
    
    const [day, month, year] = dateString.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    
    // Validate the parsed date
    if (isNaN(date.getTime())) return undefined
    return date
  }



  // Handle phone number formatting to '+91 XXXXX XXXXX'
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, '') // Remove non-digits
    
    if (value.length > 10) {
      value = value.slice(0, 10)
    }

    // Add spacing for readability
    if (value.length > 5) {
      value = value.slice(0, 5) + ' ' + value.slice(5)
    }

    onChange('phoneNumber', `+91 ${value}`)
  }

  const selectedDate = parseDate(data.dateOfBirth)

  return (
    <div className="space-y-8">
      {/* UI UPDATE: Header section with refined spacing and text styles */}
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
          <User className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
        <p className="mt-1 text-sm text-gray-500">
          Please provide your basic details to get started.
        </p>
      </div>

      {/* UI UPDATE: Form fields container with updated spacing */}
      <div className="space-y-5">
        {/* Full Name */}
        <div>
          <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <div className="mt-1">
            <Input
              id="fullName"
              type="text"
              value={data.fullName}
              onChange={(e) => onChange('fullName', e.target.value)}
              onBlur={() => handleBlur('fullName')}
              placeholder="Enter your full legal name"
              className={errors.fullName && touched.fullName ? 'border-red-500' : ''}
            />
          </div>
          {errors.fullName && touched.fullName && (
            <p className="mt-1.5 text-xs text-red-600">{errors.fullName}</p>
          )}
        </div>

        {/* Date of Birth - Date Picker Only */}
        <div>
          <Label htmlFor="dob" className="text-sm font-medium text-gray-700">
            Date of Birth <span className="text-red-500">*</span>
          </Label>
          <div className="mt-1">
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !data.dateOfBirth && "text-muted-foreground",
                    errors.dateOfBirth && touched.dateOfBirth && "border-red-500"
                  )}
                  onBlur={() => handleBlur('dateOfBirth')}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.dateOfBirth ? data.dateOfBirth : "Select date of birth"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => 
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                  captionLayout="dropdown-years"
                  fromYear={1950}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          </div>
          {errors.dateOfBirth && touched.dateOfBirth && (
            <p className="mt-1.5 text-xs text-red-600">{errors.dateOfBirth}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Phone className="h-4 w-4 text-gray-500" />
            </div>
            <Input
              id="phone"
              type="tel"
              value={data.phoneNumber}
              onChange={handlePhoneChange}
              onBlur={() => handleBlur('phoneNumber')}
              placeholder="+91 XXXXX XXXXX"
              className={`pl-10 ${errors.phoneNumber && touched.phoneNumber ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.phoneNumber && touched.phoneNumber && (
            <p className="mt-1.5 text-xs text-red-600">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <Label htmlFor="address" className="text-sm font-medium text-gray-700">
            Address <span className="text-red-500">*</span>
          </Label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute left-3.5 top-3.5">
              <MapPin className="h-4 w-4 text-gray-500" />
            </div>
            <Textarea
              id="address"
              value={data.address}
              onChange={(e) => onChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              placeholder="Enter your full address"
              className={`min-h-[100px] pl-10 pt-3 ${errors.address && touched.address ? 'border-red-500' : ''}`}
              rows={3}
            />
          </div>
          {errors.address && touched.address && (
            <p className="mt-1.5 text-xs text-red-600">{errors.address}</p>
          )}
        </div>
      </div>
    </div>
  )
}