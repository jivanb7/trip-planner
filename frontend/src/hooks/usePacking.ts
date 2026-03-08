import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { packingApi } from '@/api/endpoints/packing'
import type { PackingItem } from '@/types'
import { toast } from 'sonner'

export function usePacking(tripId: string) {
  return useQuery({
    queryKey: ['trips', tripId, 'packing'],
    queryFn: () => packingApi.list(tripId),
    enabled: !!tripId,
  })
}

export function useCreatePackingItem(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<PackingItem>) => packingApi.create(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'packing'] })
      toast.success('Packing item added!')
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to add packing item')
    },
  })
}

export function useUpdatePackingItem(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PackingItem> }) => packingApi.update(tripId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'packing'] })
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to update packing item')
    },
  })
}

export function useDeletePackingItem(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => packingApi.delete(tripId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'packing'] })
      toast.success('Packing item removed!')
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to remove packing item')
    },
  })
}
