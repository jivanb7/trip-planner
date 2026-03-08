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
                  {budget.budget_remaining_usd != null
                    ? formatCurrency(budget.budget_remaining_usd, budget.currency)
                    : 'N/A'}
                </p>
                <p className="text-xs text-muted-foreground">
                  remaining of {budget.budget != null ? formatCurrency(budget.budget, budget.currency) : 'no budget set'}
                </p>
              </div>
              <Progress
                value={getPercentage(budget.total_spent_usd, budget.budget ?? 0)}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {formatCurrency(budget.total_spent_usd, budget.currency)} spent
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-2xl font-bold">
                {trip.budget != null ? formatCurrency(trip.budget, trip.currency) : 'Not set'}
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
                {nextActivity.category && (
                  <Badge variant="secondary" className="text-xs capitalize">
                    {nextActivity.category}
                  </Badge>
                )}
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
                {currentAccommodation.check_in ? formatDate(currentAccommodation.check_in) : '?'}
                {' - '}
                {currentAccommodation.check_out ? formatDate(currentAccommodation.check_out) : '?'}
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
                  <p className="text-sm font-medium">{w.condition ?? 'Unknown'}</p>
                  {w.high_temp != null && <p className="text-lg font-bold">{w.high_temp}°</p>}
                  {w.low_temp != null && <p className="text-xs text-muted-foreground">{w.low_temp}°</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-4">No weather data available</p>
          )}
        </CardContent>
      </Card>

      {/* Trip Description */}
      {trip.description && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="size-4" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{trip.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
