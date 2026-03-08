import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { itineraryApi } from '@/api/endpoints/itinerary'
import type { ItineraryItem } from '@/types'
import { toast } from 'sonner'

export function useItinerary(tripId: string) {
  return useQuery({
    queryKey: ['trips', tripId, 'itinerary'],
    queryFn: () => itineraryApi.list(tripId),
    enabled: !!tripId,
  })
}

export function useCreateItineraryItem(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<ItineraryItem>) => itineraryApi.create(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'itinerary'] })
      toast.success('Itinerary item added!')
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to add itinerary item')
    },
  })
}

export function useUpdateItineraryItem(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItineraryItem> }) => itineraryApi.update(tripId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'itinerary'] })
      toast.success('Itinerary item updated!')
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to update itinerary item')
    },
  })
}

export function useDeleteItineraryItem(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => itineraryApi.delete(tripId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'itinerary'] })
      toast.success('Itinerary item removed!')
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to remove itinerary item')
    },
  })
}

export function useReorderItinerary(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (items: Array<{ id: string; day_number: number; position: number }>) =>
      itineraryApi.reorder(tripId, { items }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'itinerary'] })
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to reorder itinerary')
    },
  })
}
