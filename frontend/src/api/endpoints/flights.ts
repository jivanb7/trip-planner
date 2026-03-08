import client from '../client'
import type { Flight } from '@/types'

export const flightsApi = {
  list: (tripId: string) => client.get<Flight[]>(`/trips/${tripId}/flights`).then((r) => r.data),
  get: (tripId: string, id: string) => client.get<Flight>(`/trips/${tripId}/flights/${id}`).then((r) => r.data),
  create: (tripId: string, data: Partial<Flight>) => client.post<Flight>(`/trips/${tripId}/flights`, data).then((r) => r.data),
  update: (tripId: string, id: string, data: Partial<Flight>) => client.put<Flight>(`/trips/${tripId}/flights/${id}`, data).then((r) => r.data),
  delete: (tripId: string, id: string) => client.delete(`/trips/${tripId}/flights/${id}`),
}
