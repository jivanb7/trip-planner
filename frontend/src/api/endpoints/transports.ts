import client from '../client'
import type { Transport } from '@/types'

export const transportsApi = {
  list: (tripId: string) => client.get<Transport[]>(`/trips/${tripId}/transports`).then((r) => r.data),
  get: (tripId: string, id: string) => client.get<Transport>(`/trips/${tripId}/transports/${id}`).then((r) => r.data),
  create: (tripId: string, data: Partial<Transport>) => client.post<Transport>(`/trips/${tripId}/transports`, data).then((r) => r.data),
  update: (tripId: string, id: string, data: Partial<Transport>) => client.put<Transport>(`/trips/${tripId}/transports/${id}`, data).then((r) => r.data),
  delete: (tripId: string, id: string) => client.delete(`/trips/${tripId}/transports/${id}`),
}
