'use client'

import { useState } from 'react'
import { X, CheckCircle, Loader2, GraduationCap } from 'lucide-react'
import { useForm } from 'react-hook-form'

interface InterestFormData {
  name: string
  phone: string
  email: string
  caLevel: string
  attempt: string
  message?: string
}

interface InterestModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function InterestModal({ isOpen, onClose }: InterestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors }, reset } = useForm<InterestFormData>()

  const onSubmit = async (data: InterestFormData) => {
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/show-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to submit')

      setIsSuccess(true)
      reset()
    } catch {
      setError('Something went wrong. Please try WhatsApp instead.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsSuccess(false)
    setError('')
    reset()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-green-800 to-green-700 p-6 rounded-t-2xl">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Show Your Interest</h2>
              <p className="text-green-200 text-sm">We&apos;ll reach out within a few hours</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Success State */}
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Interest Registered!</h3>
              <p className="text-slate-500 mb-6">
                Thank you! CA Nikesh Shah will contact you within a few hours on WhatsApp or phone.
              </p>
              <div className="bg-green-50 rounded-xl p-4 text-sm text-slate-600 mb-6">
                <strong className="text-slate-800">While you wait —</strong> watch the free preview lecture on our course page. It&apos;s the best way to experience the teaching style before enrolling.
              </div>
              <button
                onClick={handleClose}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <p className="text-slate-500 text-sm mb-6">
                Fill in your details and CA Nikesh Shah&apos;s team will contact you personally to guide you through enrollment.
              </p>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-slate-400"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  WhatsApp / Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="flex items-center px-3 bg-slate-50 border border-r-0 border-slate-200 rounded-l-xl text-slate-500 text-sm">
                    🇮🇳 +91
                  </span>
                  <input
                    {...register('phone', {
                      required: 'Phone is required',
                      pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit Indian mobile number' }
                    })}
                    placeholder="9876543210"
                    maxLength={10}
                    className="flex-1 border border-slate-200 rounded-r-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-slate-400"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' }
                  })}
                  type="email"
                  placeholder="rahul@example.com"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-slate-400"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* CA Level */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  CA Level <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('caLevel', { required: 'Please select your CA level' })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="">Select your level</option>
                  <option value="CA Final">CA Final</option>
                  <option value="CA Intermediate">CA Intermediate</option>
                  <option value="CA Foundation">CA Foundation</option>
                  <option value="Not yet enrolled in CA">Not yet enrolled in CA</option>
                </select>
                {errors.caLevel && <p className="text-red-500 text-xs mt-1">{errors.caLevel.message}</p>}
              </div>

              {/* Attempt */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Which attempt is this? <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('attempt', { required: 'Please select your attempt' })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="">Select attempt</option>
                  <option value="1st attempt">1st attempt — fresh start</option>
                  <option value="2nd attempt">2nd attempt — appeared once before</option>
                  <option value="3rd+ attempt">3rd attempt or more</option>
                  <option value="Just exploring">Just exploring, not yet decided</option>
                </select>
                {errors.attempt && <p className="text-red-500 text-xs mt-1">{errors.attempt.message}</p>}
              </div>

              {/* Optional message */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Any questions? <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  {...register('message')}
                  placeholder="e.g. I have my exam in May 2025. Is there enough time to complete the course?"
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-slate-400 resize-none"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-4 rounded-xl text-base transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Register My Interest →'
                )}
              </button>

              <p className="text-center text-xs text-slate-400">
                We respect your privacy. Your details will only be used to contact you about this course.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
