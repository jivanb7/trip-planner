import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { transportsApi } from '@/api/endpoints/transports'
import type { Transport } from '@/types'
import { toast } from 'sonner'

export function useTransports(tripId: string) {
  return useQuery({
    queryKey: ['trips', tripId, 'transports'],
    queryFn: () => transportsApi.list(tripId),
    enabled: !!tripId,
  })
}

export function useCreateTransport(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Transport>) => transportsApi.create(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'transports'] })
      toast.success('Transport added!')
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to add transport')
    },
  })
}

export function useDeleteTransport(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => transportsApi.delete(tripId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'transports'] })
      toast.success('Transport removed!')
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to remove transport')
    },
  })
}
