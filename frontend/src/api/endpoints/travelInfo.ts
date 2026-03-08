import client from '../client'
import type { TravelInfo } from '@/types'

export const travelInfoApi = {
  get: (tripId: string) => client.get<TravelInfo>(`/trips/${tripId}/travel-info`).then((r) => r.data),
  update: (tripId: string, data: Partial<TravelInfo>) => client.put<TravelInfo>(`/trips/${tripId}/travel-info`, data).then((r) => r.data),
}
