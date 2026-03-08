import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Droplets, Wind, SunDim } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/formatters'
import type { WeatherInfo } from '@/types'

function getWeatherIcon(condition: string) {
  const c = condition.toLowerCase()
  if (c.includes('thunder') || c.includes('storm')) return <CloudLightning className="size-8 text-purple-500" />
  if (c.includes('snow') || c.includes('sleet')) return <CloudSnow className="size-8 text-blue-300" />
  if (c.includes('rain') || c.includes('drizzle')) return <CloudRain className="size-8 text-blue-500" />
  if (c.includes('cloud') || c.includes('overcast')) return <Cloud className="size-8 text-gray-400" />
  if (c.includes('haze') || c.includes('fog') || c.includes('mist')) return <SunDim className="size-8 text-yellow-300" />
  return <Sun className="size-8 text-yellow-500" />
}

interface WeatherDayCardProps {
  weather: WeatherInfo
}

export function WeatherDayCard({ weather }: WeatherDayCardProps) {
  return (
    <Card>
      <CardContent className="p-4 text-center space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{formatDate(weather.date)}</p>
        <div className="flex justify-center">{getWeatherIcon(weather.condition)}</div>
        <p className="text-sm font-medium capitalize">{weather.condition}</p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg font-bold">{weather.temperature_high}°</span>
          <span className="text-sm text-muted-foreground">{weather.temperature_low}°</span>
        </div>
        <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
          {weather.rain_chance != null && (
            <div className="flex items-center gap-1">
              <Droplets className="size-3" />
              <span>{weather.rain_chance}%</span>
            </div>
          )}
          {weather.uv_index != null && (
            <div className="flex items-center gap-1">
              <Sun className="size-3" />
              <span>UV {weather.uv_index}</span>
            </div>
          )}
          {weather.wind_speed != null && (
            <div className="flex items-center gap-1">
              <Wind className="size-3" />
              <span>{weather.wind_speed} km/h</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
