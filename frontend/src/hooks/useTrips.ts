import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tripsApi } from '@/api/endpoints/trips'
import type { TripCreateForm } from '@/types'
import { toast } from 'sonner'

export function useTrips() {
  return useQuery({
    queryKey: ['trips'],
    queryFn: tripsApi.list,
  })
}

export function useTrip(id: string) {
  return useQuery({
    queryKey: ['trips', id],
    queryFn: () => tripsApi.get(id),
    enabled: !!id,
  })
}

export function useTripSummary(id: string) {
  return useQuery({
    queryKey: ['trips', id, 'summary'],
    queryFn: () => tripsApi.getSummary(id),
    enabled: !!id,
  })
}

export function useTripBudget(id: string) {
  return useQuery({
    queryKey: ['trips', id, 'budget'],
    queryFn: () => tripsApi.getBudget(id),
    enabled: !!id,
  })
}

export function useCreateTrip() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TripCreateForm) => tripsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      toast.success('Trip created successfully!')
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to create trip')
    },
  })
}

export function useUpdateTrip() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TripCreateForm> }) => tripsApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      queryClient.invalidateQueries({ queryKey: ['trips', variables.id] })
      toast.success('Trip updated successfully!')
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to update trip')
    },
  })
}

export function useDeleteTrip() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => tripsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      toast.success('Trip deleted successfully!')
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to delete trip')
    },
  })
}
