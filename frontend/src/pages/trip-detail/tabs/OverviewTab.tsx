import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar, MapPin, DollarSign, CloudSun, AlertTriangle } from 'lucide-react'
import { useTripBudget } from '@/hooks/useTrips'
import { useActivities } from '@/hooks/useActivities'
import { useAccommodations } from '@/hooks/useAccommodations'
import { useWeather } from '@/hooks/useWeather'
import { formatCurrency, formatDate, getPercentage } from '@/lib/formatters'
import { ACTIVITY_TYPE_LABELS } from '@/lib/constants'
import type { Trip } from '@/types'

interface OverviewTabProps {
  tripId: string
  trip: Trip
}

export function OverviewTab({ tripId, trip }: OverviewTabProps) {
  const { data: budget, isLoading: budgetLoading } = useTripBudget(tripId)
  const { data: activities } = useActivities(tripId)
  const { data: accommodations } = useAccommodations(tripId)
  const { data: weather } = useWeather(tripId)

  const nextActivity = activities
    ?.filter((a) => a.date && new Date(a.date) >= new Date())
    .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime())[0]

  const currentAccommodation = accommodations?.[0]
  const upcomingWeather = weather?.slice(0, 3)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Budget Card */}
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="size-4" />
            Budget
          </CardTitle>
        </CardHeader>
        <CardContent>
          {budgetLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-2 w-full" />
            </div>
          ) : budget ? (
            <div className="space-y-3">
              <div>
                <p className="text-2xl font-bold">
                  {formatCurrency(budget.remaining, budget.currency)}
                </p>
                <p className="text-xs text-muted-foreground">
                  remaining of {formatCurrency(budget.budget, budget.currency)}
                </p>
              </div>
              <Progress
                value={getPercentage(budget.total_spent, budget.budget)}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {formatCurrency(budget.total_spent, budget.currency)} spent
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-2xl font-bold">
                {formatCurrency(trip.budget, trip.currency)}
              </p>
              <p className="text-xs text-muted-foreground">No expenses tracked yet</p>
              <Progress value={0} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Activity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="size-4" />
            Next Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {nextActivity ? (
            <div className="space-y-2">
              <p className="font-semibold">{nextActivity.name}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className="text-xs">
                  {ACTIVITY_TYPE_LABELS[nextActivity.activity_type]}
                </Badge>
                {nextActivity.date && <span>{formatDate(nextActivity.date)}</span>}
              </div>
              {nextActivity.location && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3" />
                  {nextActivity.location}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-4">No upcoming activities</p>
          )}
        </CardContent>
      </Card>

      {/* Accommodation */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <MapPin className="size-4" />
            Accommodation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentAccommodation ? (
            <div className="space-y-2">
              <p className="font-semibold">{currentAccommodation.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(currentAccommodation.check_in)} - {formatDate(currentAccommodation.check_out)}
              </p>
              {currentAccommodation.address && (
                <p className="text-xs text-muted-foreground">{currentAccommodation.address}</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-4">No accommodation booked</p>
          )}
        </CardContent>
      </Card>

      {/* Weather Snapshot */}
      <Card className="md:col-span-2 lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CloudSun className="size-4" />
            Weather Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingWeather && upcomingWeather.length > 0 ? (
            <div className="flex gap-4">
              {upcomingWeather.map((w) => (
                <div key={w.id} className="flex-1 text-center space-y-1">
                  <p className="text-xs text-muted-foreground">{formatDate(w.date)}</p>
                  <p className="text-sm font-medium">{w.condition}</p>
                  <p className="text-lg font-bold">{w.temperature_high}°</p>
                  <p className="text-xs text-muted-foreground">{w.temperature_low}°</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-4">No weather data available</p>
          )}
        </CardContent>
      </Card>

      {/* Trip Notes */}
      {trip.notes && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="size-4" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{trip.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
