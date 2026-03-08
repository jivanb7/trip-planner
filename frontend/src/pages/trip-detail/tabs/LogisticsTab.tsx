import { Plane, Train, Building2 } from 'lucide-react'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { FlightCard } from '../components/FlightCard'
import { AccommodationCard } from '../components/AccommodationCard'
import { useFlights, useDeleteFlight } from '@/hooks/useFlights'
import { useTransports, useDeleteTransport } from '@/hooks/useTransports'
import { useAccommodations, useDeleteAccommodation } from '@/hooks/useAccommodations'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2, ArrowRight } from 'lucide-react'
import { TRANSPORT_TYPE_LABELS } from '@/lib/constants'
import { formatTime, formatCurrency } from '@/lib/formatters'
import type { Transport } from '@/types'

interface LogisticsTabProps {
  tripId: string
}

function TransportCard({ transport, onDelete }: { transport: Transport; onDelete?: (id: string) => void }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-full bg-amber-50 text-amber-600">
              <Train className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{transport.from_location}</span>
                <ArrowRight className="size-4 text-muted-foreground" />
                <span className="font-semibold">{transport.to_location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className="text-xs capitalize">
                  {TRANSPORT_TYPE_LABELS[transport.type as keyof typeof TRANSPORT_TYPE_LABELS] ?? transport.type}
                </Badge>
                {transport.departure_time && transport.arrival_time && (
                  <span>{formatTime(transport.departure_time)} - {formatTime(transport.arrival_time)}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {transport.cost != null && transport.cost > 0 && (
              <span className="text-sm">{formatCurrency(transport.cost, transport.currency || 'USD')}</span>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => onDelete(transport.id)}
                className="text-muted-foreground hover:text-destructive"
                aria-label="Delete transport"
              >
                <Trash2 className="size-3.5" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function LogisticsTab({ tripId }: LogisticsTabProps) {
  const { data: flights, isLoading: flightsLoading } = useFlights(tripId)
  const { data: transports, isLoading: transportsLoading } = useTransports(tripId)
  const { data: accommodations, isLoading: accommodationsLoading } = useAccommodations(tripId)
  const deleteFlight = useDeleteFlight(tripId)
  const deleteTransport = useDeleteTransport(tripId)
  const deleteAccommodation = useDeleteAccommodation(tripId)

  const isLoading = flightsLoading || transportsLoading || accommodationsLoading

  if (isLoading) return <LoadingSpinner className="py-16" text="Loading logistics..." />

  const hasContent = (flights?.length || 0) + (transports?.length || 0) + (accommodations?.length || 0) > 0

  if (!hasContent) {
    return (
      <EmptyState
        title="No logistics yet"
        description="Flights, transportation, and accommodations will appear here once added."
      />
    )
  }

  return (
    <div className="space-y-6">
      {flights && flights.length > 0 && (
        <section className="space-y-3">
          <h3 className="flex items-center gap-2 font-semibold text-lg">
            <Plane className="size-5" />
            Flights
          </h3>
          <div className="grid gap-3">
            {flights.map((f) => (
              <FlightCard key={f.id} flight={f} onDelete={(id) => deleteFlight.mutate(id)} />
            ))}
          </div>
        </section>
      )}

      {transports && transports.length > 0 && (
        <section className="space-y-3">
          <h3 className="flex items-center gap-2 font-semibold text-lg">
            <Train className="size-5" />
            Transportation
          </h3>
          <div className="grid gap-3">
            {transports.map((t) => (
              <TransportCard key={t.id} transport={t} onDelete={(id) => deleteTransport.mutate(id)} />
            ))}
          </div>
        </section>
      )}

      {accommodations && accommodations.length > 0 && (
        <section className="space-y-3">
          <h3 className="flex items-center gap-2 font-semibold text-lg">
            <Building2 className="size-5" />
            Accommodations
          </h3>
          <div className="grid gap-3">
            {accommodations.map((a) => (
              <AccommodationCard key={a.id} accommodation={a} onDelete={(id) => deleteAccommodation.mutate(id)} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
