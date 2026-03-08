import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { ActivityCard } from '../components/ActivityCard'
import { useActivities, useDeleteActivity } from '@/hooks/useActivities'
import { ACTIVITY_TYPE_LABELS } from '@/lib/constants'

interface ActivitiesTabProps {
  tripId: string
}

export function ActivitiesTab({ tripId }: ActivitiesTabProps) {
  const { data: activities, isLoading } = useActivities(tripId)
  const deleteActivity = useDeleteActivity(tripId)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = activities?.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'all' || a.activity_type === typeFilter
    return matchesSearch && matchesType
  })

  if (isLoading) return <LoadingSpinner className="py-16" text="Loading activities..." />

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search activities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SlidersHorizontal className="size-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.entries(ACTIVITY_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button size="sm" disabled>
          <Plus className="size-4" />
          Add Activity
        </Button>
      </div>

      {filtered && filtered.length === 0 && (
        <EmptyState
          title="No activities yet"
          description="Activities will appear here once added via the API or Claude."
        />
      )}

      {filtered && filtered.length > 0 && (
        <motion.div
          className="grid gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filtered.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </motion.div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Activity"
        description="Are you sure you want to remove this activity? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        loading={deleteActivity.isPending}
        onConfirm={() => {
          if (deleteId) {
            deleteActivity.mutate(deleteId, {
              onSuccess: () => setDeleteId(null),
            })
          }
        }}
      />
    </div>
  )
}
