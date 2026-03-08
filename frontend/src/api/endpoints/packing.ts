import client from '../client'
import type { PackingItem } from '@/types'

export const packingApi = {
  list: (tripId: string) => client.get<PackingItem[]>(`/trips/${tripId}/packing`).then((r) => r.data),
  create: (tripId: string, data: Partial<PackingItem>) => client.post<PackingItem>(`/trips/${tripId}/packing`, data).then((r) => r.data),
  update: (tripId: string, id: string, data: Partial<PackingItem>) => client.put<PackingItem>(`/trips/${tripId}/packing/${id}`, data).then((r) => r.data),
  delete: (tripId: string, id: string) => client.delete(`/trips/${tripId}/packing/${id}`),
}
