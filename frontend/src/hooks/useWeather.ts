import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { weatherApi } from '@/api/endpoints/weather'
import type { WeatherInfo } from '@/types'
import { toast } from 'sonner'

export function useWeather(tripId: string) {
  return useQuery({
    queryKey: ['trips', tripId, 'weather'],
    queryFn: () => weatherApi.list(tripId),
    enabled: !!tripId,
  })
}

export function useCreateWeather(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<WeatherInfo>) => weatherApi.create(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'weather'] })
      toast.success('Weather forecast added!')
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to add weather forecast')
    },
  })
}

export function useDeleteWeather(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => weatherApi.delete(tripId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'weather'] })
      toast.success('Weather forecast removed!')
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to remove weather forecast')
    },
  })
}
