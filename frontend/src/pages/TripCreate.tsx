import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, MapPin, Calendar, Wallet, FileText, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useCreateTrip } from '@/hooks/useTrips'
import { CURRENCIES } from '@/lib/constants'

const tripSchema = z.object({
  name: z.string().min(1, 'Trip name is required'),
  destination: z.string().min(1, 'Destination is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  budget: z.number().min(0, 'Budget must be positive'),
  currency: z.string().min(1, 'Currency is required'),
  description: z.string(),
})

type FormValues = z.infer<typeof tripSchema>

const steps = [
  { id: 1, title: 'Destination', icon: MapPin, description: 'Where are you going?' },
  { id: 2, title: 'Dates', icon: Calendar, description: 'When is your trip?' },
  { id: 3, title: 'Budget', icon: Wallet, description: 'Set your budget' },
  { id: 4, title: 'Details', icon: FileText, description: 'Trip description' },
]

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -200 : 200,
    opacity: 0,
  }),
}

export function TripCreate() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const createTrip = useCreateTrip()
  const shouldReduceMotion = useReducedMotion()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      name: '',
      destination: '',
      start_date: '',
      end_date: '',
      budget: 0,
      currency: 'USD',
      description: '',
    },
  })

  const watchedValues = watch()

  const canProceed = async () => {
    const fieldsPerStep: (keyof FormValues)[][] = [
      ['name', 'destination'],
      ['start_date', 'end_date'],
      ['budget', 'currency'],
      ['description'],
    ]
    return trigger(fieldsPerStep[currentStep])
  }

  const nextStep = async () => {
    const valid = await canProceed()
    if (valid && currentStep < steps.length - 1) {
      setDirection(1)
      setCurrentStep((s) => s + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep((s) => s - 1)
    }
  }

  const onSubmit = (data: FormValues) => {
    createTrip.mutate(data, {
      onSuccess: (trip) => {
        navigate(`/trips/${trip.id}`)
      },
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create a New Trip</h1>
        <p className="text-muted-foreground">
          Fill in the details to start planning your trip
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {steps.map((step, index) => {
          const StepIcon = step.icon
          const isActive = index === currentStep
          const isCompleted = index < currentStep
          return (
            <div key={step.id} className="flex items-center gap-2 flex-1">
              <div
                className={`flex items-center justify-center size-8 rounded-full border-2 transition-colors ${
                  isCompleted
                    ? 'bg-primary border-primary text-primary-foreground'
                    : isActive
                      ? 'border-primary text-primary'
                      : 'border-muted text-muted-foreground'
                }`}
              >
                {isCompleted ? (
                  <Check className="size-4" />
                ) : (
                  <StepIcon className="size-4" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 transition-colors ${
                    isCompleted ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={shouldReduceMotion ? { enter: {}, center: {}, exit: {} } : slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
              >
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Trip Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Tokyo Adventure 2026"
                        {...register('name')}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destination">Destination</Label>
                      <Input
                        id="destination"
                        placeholder="e.g., Tokyo, Japan"
                        {...register('destination')}
                      />
                      {errors.destination && (
                        <p className="text-sm text-destructive">{errors.destination.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_date">Start Date</Label>
                      <Input
                        id="start_date"
                        type="date"
                        {...register('start_date')}
                      />
                      {errors.start_date && (
                        <p className="text-sm text-destructive">{errors.start_date.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end_date">End Date</Label>
                      <Input
                        id="end_date"
                        type="date"
                        {...register('end_date')}
                      />
                      {errors.end_date && (
                        <p className="text-sm text-destructive">{errors.end_date.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget</Label>
                      <Input
                        id="budget"
                        type="number"
                        min={0}
                        step={100}
                        placeholder="5000"
                        {...register('budget', { valueAsNumber: true })}
                      />
                      {errors.budget && (
                        <p className="text-sm text-destructive">{errors.budget.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select
                        value={watchedValues.currency}
                        onValueChange={(val) => setValue('currency', val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCIES.map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.symbol} {c.name} ({c.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (optional)</Label>
                      <Textarea
                        id="description"
                        placeholder="Any special plans or notes about your trip..."
                        rows={4}
                        {...register('description')}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="size-4" />
                Back
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                  <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={createTrip.isPending}>
                  {createTrip.isPending ? 'Creating...' : 'Create Trip'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
