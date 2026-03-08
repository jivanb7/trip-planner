import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CalendarDays } from 'lucide-react'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { ItineraryDayGroup } from '../components/ItineraryDayGroup'
import { useItinerary, useReorderItinerary } from '@/hooks/useItinerary'
import { getDayCount } from '@/lib/formatters'
import type { Trip } from '@/types'

interface ItineraryTabProps {
  tripId: string
  trip: Trip
}

export function ItineraryTab({ tripId, trip }: ItineraryTabProps) {
  const { data: items, isLoading } = useItinerary(tripId)
  const reorder = useReorderItinerary(tripId)

  const dayCount = getDayCount(trip.start_date, trip.end_date)

  if (isLoading) return <LoadingSpinner className="py-16" text="Loading itinerary..." />

  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon={<CalendarDays className="size-12" />}
        title="No itinerary items yet"
        description="Add items to your itinerary to plan your day-by-day schedule."
      />
    )
  }

  // Group items by day
  const dayGroups = new Map<number, typeof items>()
  for (let d = 1; d <= dayCount; d++) {
    dayGroups.set(d, [])
  }
  for (const item of items) {
    const existing = dayGroups.get(item.day_number) || []
    existing.push(item)
    dayGroups.set(item.day_number, existing)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const allItems = items.map((item) => ({
      id: item.id,
      day_number: item.day_number,
      position: item.position,
    }))

    // Swap positions
    const activeIdx = allItems.findIndex((i) => i.id === active.id)
    const overIdx = allItems.findIndex((i) => i.id === over.id)
    if (activeIdx === -1 || overIdx === -1) return

    const temp = allItems[activeIdx].position
    allItems[activeIdx].position = allItems[overIdx].position
    allItems[overIdx].position = temp

    reorder.mutate(allItems)
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        {Array.from(dayGroups.entries())
          .filter(([, dayItems]) => dayItems.length > 0)
          .map(([dayNumber, dayItems]) => (
            <SortableContext
              key={dayNumber}
              items={dayItems.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <ItineraryDayGroup dayNumber={dayNumber} items={dayItems} />
            </SortableContext>
          ))}
      </div>
    </DndContext>
  )
}
