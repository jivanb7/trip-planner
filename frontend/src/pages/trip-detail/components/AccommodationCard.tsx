import { Building2, MapPin, Calendar, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, formatCurrency } from '@/lib/formatters'
import type { Accommodation } from '@/types'

interface AccommodationCardProps {
  accommodation: Accommodation
  onDelete?: (id: string) => void
}

export function AccommodationCard({ accommodation, onDelete }: AccommodationCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <div className="flex items-center justify-center size-10 rounded-full bg-purple-50 text-purple-600">
              <Building2 className="size-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{accommodation.name}</h4>
                {accommodation.type && (
                  <Badge variant="secondary" className="text-xs capitalize">
                    {accommodation.type}
                  </Badge>
                )}
              </div>
              {(accommodation.check_in || accommodation.check_out) && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="size-3.5" />
                  <span>
                    {accommodation.check_in ? formatDate(accommodation.check_in) : '?'}
                    {' - '}
                    {accommodation.check_out ? formatDate(accommodation.check_out) : '?'}
                  </span>
                </div>
              )}
              {accommodation.address && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" />
                  <span>{accommodation.address}</span>
                </div>
              )}
              {accommodation.cost_per_night != null && accommodation.cost_per_night > 0 && (
                <p className="text-sm font-medium">
                  {formatCurrency(accommodation.cost_per_night, accommodation.currency)}/night
                </p>
              )}
            </div>
          </div>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onDelete(accommodation.id)}
              className="text-muted-foreground hover:text-destructive"
              aria-label="Delete accommodation"
            >
              <Trash2 className="size-3.5" />
            </Button>
          )}
        </div>
        {accommodation.confirmation_number && (
          <p className="mt-2 text-xs text-muted-foreground ml-13">
            Confirmation: {accommodation.confirmation_number}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
