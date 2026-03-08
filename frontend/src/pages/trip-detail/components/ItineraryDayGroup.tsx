import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Clock, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatTimeShort } from '@/lib/formatters'
import type { ItineraryItem } from '@/types'

interface SortableItemProps {
  item: ItineraryItem
}

export function SortableItineraryItem({ item }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="border-l-4 border-l-primary/20">
        <CardContent className="p-3 flex items-center gap-3">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
            aria-label="Drag to reorder"
          >
            <GripVertical className="size-4" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm truncate">{item.title}</p>
              {item.category && (
                <Badge variant="secondary" className="text-xs shrink-0 capitalize">
                  {item.category}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
              {item.start_time && (
                <div className="flex items-center gap-1">
                  <Clock className="size-3" />
                  <span>
                    {formatTimeShort(item.start_time)}
                    {item.end_time && ` - ${formatTimeShort(item.end_time)}`}
                  </span>
                </div>
              )}
              {item.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="size-3" />
                  <span className="truncate">{item.location}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface ItineraryDayGroupProps {
  date: string
  items: ItineraryItem[]
}

export function ItineraryDayGroup({ date, items }: ItineraryDayGroupProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
        {date}
      </h3>
      <div className="space-y-2 pl-2 border-l-2 border-muted">
        {items
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((item) => (
            <SortableItineraryItem key={item.id} item={item} />
          ))}
      </div>
    </div>
  )
}
