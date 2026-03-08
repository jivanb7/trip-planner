import { Luggage } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { PackingCategoryGroup } from '../components/PackingCategoryGroup'
import { usePacking, useUpdatePackingItem, useDeletePackingItem } from '@/hooks/usePacking'
import { getPercentage } from '@/lib/formatters'

interface PackingTabProps {
  tripId: string
}

export function PackingTab({ tripId }: PackingTabProps) {
  const { data: items, isLoading } = usePacking(tripId)
  const updateItem = useUpdatePackingItem(tripId)
  const deleteItem = useDeletePackingItem(tripId)

  if (isLoading) return <LoadingSpinner className="py-16" text="Loading packing list..." />

  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon={<Luggage className="size-12" />}
        title="No packing list yet"
        description="Your packing list will appear here once items are added via the API or Claude."
      />
    )
  }

  const packedCount = items.filter((i) => i.packed).length
  const totalCount = items.length
  const percentage = getPercentage(packedCount, totalCount)

  // Group by category
  const groups = new Map<string, typeof items>()
  for (const item of items) {
    const existing = groups.get(item.category) || []
    existing.push(item)
    groups.set(item.category, existing)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Packing Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {packedCount} of {totalCount} items packed
              </span>
              <span className="font-medium">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from(groups.entries()).map(([category, categoryItems]) => (
          <Card key={category}>
            <CardContent className="p-4">
              <PackingCategoryGroup
                category={category}
                items={categoryItems}
                onToggle={(id, isPacked) =>
                  updateItem.mutate({ id, data: { packed: isPacked } })
                }
                onDelete={(id) => deleteItem.mutate(id)}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
