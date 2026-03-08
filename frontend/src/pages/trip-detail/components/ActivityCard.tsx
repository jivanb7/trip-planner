import { useState } from 'react'
import { Clock, MapPin, DollarSign, ExternalLink, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ACTIVITY_TYPE_LABELS, DIFFICULTY_LABELS } from '@/lib/constants'
import { formatCurrency, formatDuration, formatTimeShort } from '@/lib/formatters'
import type { Activity } from '@/types'

interface ActivityCardProps {
  activity: Activity
  onDelete?: (id: string) => void
}

export function ActivityCard({ activity, onDelete }: ActivityCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="transition-all hover:shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{activity.name}</h4>
              <Badge variant="secondary" className="text-xs">
                {ACTIVITY_TYPE_LABELS[activity.activity_type]}
              </Badge>
              {activity.difficulty && (
                <Badge variant="outline" className="text-xs">
                  {DIFFICULTY_LABELS[activity.difficulty]}
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {activity.duration_minutes && (
                <div className="flex items-center gap-1">
                  <Clock className="size-3.5" />
                  <span>{formatDuration(activity.duration_minutes)}</span>
                </div>
              )}
              {activity.start_time && (
                <span>{formatTimeShort(activity.start_time)}</span>
              )}
              {activity.cost != null && activity.cost > 0 && (
                <div className="flex items-center gap-1">
                  <DollarSign className="size-3.5" />
                  <span>{formatCurrency(activity.cost, activity.currency || 'USD')}</span>
                </div>
              )}
              {activity.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  <span>{activity.location}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {activity.booking_url && (
              <Button variant="ghost" size="icon-xs" asChild>
                <a href={activity.booking_url} target="_blank" rel="noopener noreferrer" aria-label="Open booking link">
                  <ExternalLink className="size-3.5" />
                </a>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setExpanded(!expanded)}
              aria-label={expanded ? 'Collapse details' : 'Expand details'}
            >
              {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
            </Button>
            {onDelete && (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => onDelete(activity.id)}
                aria-label="Delete activity"
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </Button>
            )}
          </div>
        </div>
        {expanded && activity.description && (
          <p className="mt-3 text-sm text-muted-foreground border-t pt-3">
            {activity.description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
