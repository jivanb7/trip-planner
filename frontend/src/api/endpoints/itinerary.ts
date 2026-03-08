import client from '../client'
import type { ItineraryItem } from '@/types'

export const itineraryApi = {
  list: (tripId: string) => client.get<ItineraryItem[]>(`/trips/${tripId}/itinerary`).then((r) => r.data),
  create: (tripId: string, data: Partial<ItineraryItem>) => client.post<ItineraryItem>(`/trips/${tripId}/itinerary`, data).then((r) => r.data),
  update: (tripId: string, id: string, data: Partial<ItineraryItem>) => client.put<ItineraryItem>(`/trips/${tripId}/itinerary/${id}`, data).then((r) => r.data),
  delete: (tripId: string, id: string) => client.delete(`/trips/${tripId}/itinerary/${id}`),
  reorder: (tripId: string, data: { items: Array<{ id: string; day_number: number; position: number }> }) =>
    client.put(`/trips/${tripId}/itinerary/reorder`, data).then((r) => r.data),
}
