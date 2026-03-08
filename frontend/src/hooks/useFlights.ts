import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { flightsApi } from '@/api/endpoints/flights'
import type { Flight } from '@/types'
import { toast } from 'sonner'

export function useFlights(tripId: string) {
  return useQuery({
    queryKey: ['trips', tripId, 'flights'],
    queryFn: () => flightsApi.list(tripId),
    enabled: !!tripId,
  })
}

export function useCreateFlight(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Flight>) => flightsApi.create(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'flights'] })
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'summary'] })
      toast.success('Flight added!')
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to add flight')
    },
  })
}

export function useDeleteFlight(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => flightsApi.delete(tripId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'flights'] })
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'summary'] })
      toast.success('Flight removed!')
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to remove flight')
    },
  })
}
