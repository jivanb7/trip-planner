import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CalendarDays } from 'lucide-react'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { ItineraryDayGroup } from '../components/ItineraryDayGroup'
import { useItinerary, useReorderItinerary } from '@/hooks/useItinerary'
import type { Trip } from '@/types'

interface ItineraryTabProps {
  tripId: string
  trip: Trip
}

export function ItineraryTab({ tripId }: ItineraryTabProps) {
  const { data: items, isLoading } = useItinerary(tripId)
  const reorder = useReorderItinerary(tripId)

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

  // Group items by date
  const dayGroups = new Map<string, typeof items>()
  for (const item of items) {
    const existing = dayGroups.get(item.date) || []
    existing.push(item)
    dayGroups.set(item.date, existing)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const allItems = items.map((item) => ({
      id: item.id,
      sort_order: item.sort_order,
    }))

    // Swap sort_order
    const activeIdx = allItems.findIndex((i) => i.id === active.id)
    const overIdx = allItems.findIndex((i) => i.id === over.id)
    if (activeIdx === -1 || overIdx === -1) return

    const temp = allItems[activeIdx].sort_order
    allItems[activeIdx].sort_order = allItems[overIdx].sort_order
    allItems[overIdx].sort_order = temp

    reorder.mutate(allItems)
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        {Array.from(dayGroups.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, dayItems]) => (
            <SortableContext
              key={date}
              items={dayItems.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <ItineraryDayGroup date={date} items={dayItems} />
            </SortableContext>
          ))}
      </div>
    </DndContext>
  )
}
