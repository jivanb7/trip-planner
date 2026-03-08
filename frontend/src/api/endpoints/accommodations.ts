import client from '../client'
import type { Accommodation } from '@/types'

export const accommodationsApi = {
  list: (tripId: string) => client.get<Accommodation[]>(`/trips/${tripId}/accommodations`).then((r) => r.data),
  get: (tripId: string, id: string) => client.get<Accommodation>(`/trips/${tripId}/accommodations/${id}`).then((r) => r.data),
  create: (tripId: string, data: Partial<Accommodation>) => client.post<Accommodation>(`/trips/${tripId}/accommodations`, data).then((r) => r.data),
  update: (tripId: string, id: string, data: Partial<Accommodation>) => client.put<Accommodation>(`/trips/${tripId}/accommodations/${id}`, data).then((r) => r.data),
  delete: (tripId: string, id: string) => client.delete(`/trips/${tripId}/accommodations/${id}`),
}
