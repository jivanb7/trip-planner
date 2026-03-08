import { Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, Wallet } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TRIP_STATUS_LABELS, TRIP_STATUS_COLORS } from '@/lib/constants'
import { formatDateRange, formatCurrency, getDayCount } from '@/lib/formatters'
import type { Trip } from '@/types'

interface TripHeaderProps {
  trip: Trip
}

export function TripHeader({ trip }: TripHeaderProps) {
  const dayCount = getDayCount(trip.start_date ?? '', trip.end_date ?? '')

  return (
    <div className="space-y-4">
      <Link to="/">
        <Button variant="ghost" size="sm" className="gap-1.5">
          <ArrowLeft className="size-4" />
          Back to trips
        </Button>
      </Link>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{trip.name}</h1>
            <Badge variant="secondary" className={TRIP_STATUS_COLORS[trip.status] ?? ''}>
              {TRIP_STATUS_LABELS[trip.status] ?? trip.status}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="size-4" />
              <span>{trip.destination}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              <span>{formatDateRange(trip.start_date ?? '', trip.end_date ?? '')}</span>
              {dayCount > 0 && <span className="text-xs">({dayCount} days)</span>}
            </div>
            {trip.budget != null && (
              <div className="flex items-center gap-1.5">
                <Wallet className="size-4" />
                <span>{formatCurrency(trip.budget, trip.currency)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
