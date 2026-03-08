import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { travelInfoApi } from '@/api/endpoints/travelInfo'
import type { TravelInfo } from '@/types'
import { toast } from 'sonner'

export function useTravelInfo(tripId: string) {
  return useQuery({
    queryKey: ['trips', tripId, 'travel-info'],
    queryFn: () => travelInfoApi.get(tripId),
    enabled: !!tripId,
    retry: (failureCount, error: { status?: number }) => {
      if (error?.status === 404) return false
      return failureCount < 3
    },
  })
}

export function useUpdateTravelInfo(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<TravelInfo>) => travelInfoApi.update(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'travel-info'] })
      toast.success('Travel info updated!')
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to update travel info')
    },
  })
}
