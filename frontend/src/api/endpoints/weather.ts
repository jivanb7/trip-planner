import client from '../client'
import type { WeatherInfo } from '@/types'

export const weatherApi = {
  list: (tripId: string) => client.get<WeatherInfo[]>(`/trips/${tripId}/weather`).then((r) => r.data),
  create: (tripId: string, data: Partial<WeatherInfo>) => client.post<WeatherInfo>(`/trips/${tripId}/weather`, data).then((r) => r.data),
  delete: (tripId: string, id: string) => client.delete(`/trips/${tripId}/weather/${id}`),
}
