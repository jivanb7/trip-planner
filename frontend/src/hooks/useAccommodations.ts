import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { accommodationsApi } from '@/api/endpoints/accommodations'
import type { Accommodation } from '@/types'
import { toast } from 'sonner'

export function useAccommodations(tripId: string) {
  return useQuery({
    queryKey: ['trips', tripId, 'accommodations'],
    queryFn: () => accommodationsApi.list(tripId),
    enabled: !!tripId,
  })
}

export function useCreateAccommodation(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Accommodation>) => accommodationsApi.create(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'accommodations'] })
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'summary'] })
      toast.success('Accommodation added!')
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to add accommodation')
    },
  })
}

export function useUpdateAccommodation(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Accommodation> }) => accommodationsApi.update(tripId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'accommodations'] })
      toast.success('Accommodation updated!')
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to update accommodation')
    },
  })
}

export function useDeleteAccommodation(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => accommodationsApi.delete(tripId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'accommodations'] })
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'summary'] })
      toast.success('Accommodation removed!')
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to remove accommodation')
    },
  })
}
