import client from '../client'
import type { Activity, ActivityCreateForm } from '@/types'

export const activitiesApi = {
  list: (tripId: string) => client.get<Activity[]>(`/trips/${tripId}/activities`).then((r) => r.data),
  get: (tripId: string, id: string) => client.get<Activity>(`/trips/${tripId}/activities/${id}`).then((r) => r.data),
  create: (tripId: string, data: Partial<ActivityCreateForm>) => client.post<Activity>(`/trips/${tripId}/activities`, data).then((r) => r.data),
  update: (tripId: string, id: string, data: Partial<ActivityCreateForm>) => client.put<Activity>(`/trips/${tripId}/activities/${id}`, data).then((r) => r.data),
  delete: (tripId: string, id: string) => client.delete(`/trips/${tripId}/activities/${id}`),
}
