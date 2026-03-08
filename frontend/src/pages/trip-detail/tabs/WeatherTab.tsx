import { CloudSun } from 'lucide-react'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { WeatherDayCard } from '../components/WeatherDayCard'
import { useWeather } from '@/hooks/useWeather'

interface WeatherTabProps {
  tripId: string
}

export function WeatherTab({ tripId }: WeatherTabProps) {
  const { data: weather, isLoading } = useWeather(tripId)

  if (isLoading) return <LoadingSpinner className="py-16" text="Loading weather..." />

  if (!weather || weather.length === 0) {
    return (
      <EmptyState
        icon={<CloudSun className="size-12" />}
        title="No weather data yet"
        description="Weather forecasts will appear here once added via the API or Claude."
      />
    )
  }

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {weather
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((w) => (
          <WeatherDayCard key={w.id} weather={w} />
        ))}
    </div>
  )
}
