import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { activitiesApi } from '@/api/endpoints/activities'
import type { ActivityCreateForm } from '@/types'
import { toast } from 'sonner'

export function useActivities(tripId: string) {
  return useQuery({
    queryKey: ['trips', tripId, 'activities'],
    queryFn: () => activitiesApi.list(tripId),
    enabled: !!tripId,
  })
}

export function useCreateActivity(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<ActivityCreateForm>) => activitiesApi.create(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'activities'] })
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'summary'] })
      toast.success('Activity added!')
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to add activity')
    },
  })
}

export function useUpdateActivity(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ActivityCreateForm> }) => activitiesApi.update(tripId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'activities'] })
      toast.success('Activity updated!')
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to update activity')
    },
  })
}

export function useDeleteActivity(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => activitiesApi.delete(tripId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'activities'] })
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'summary'] })
      toast.success('Activity removed!')
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to remove activity')
    },
  })
}
