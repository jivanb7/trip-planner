import { Plane, ArrowRight, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatTime, formatCurrency } from '@/lib/formatters'
import type { Flight } from '@/types'

interface FlightCardProps {
  flight: Flight
  onDelete?: (id: string) => void
}

export function FlightCard({ flight, onDelete }: FlightCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center size-10 rounded-full bg-blue-50 text-blue-600">
              <Plane className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{flight.departure_airport}</span>
                <ArrowRight className="size-4 text-muted-foreground" />
                <span className="font-semibold">{flight.arrival_airport}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                  {[flight.airline, flight.flight_number].filter(Boolean).join(' ')}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right text-sm">
              <p>
                {flight.departure_time ? formatTime(flight.departure_time) : '?'}
                {' - '}
                {flight.arrival_time ? formatTime(flight.arrival_time) : '?'}
              </p>
              {flight.cost != null && flight.cost > 0 && (
                <p className="text-muted-foreground">{formatCurrency(flight.cost, flight.currency)}</p>
              )}
            </div>
            {onDelete && (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => onDelete(flight.id)}
                className="text-muted-foreground hover:text-destructive"
                aria-label="Delete flight"
              >
                <Trash2 className="size-3.5" />
              </Button>
            )}
          </div>
        </div>
        {flight.confirmation_number && (
          <p className="mt-2 text-xs text-muted-foreground">
            Confirmation: {flight.confirmation_number}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
