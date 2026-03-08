import client from '../client'
import type { Trip, TripCreateForm, TripSummary, BudgetInfo } from '@/types'

export const tripsApi = {
  list: () => client.get<Trip[]>('/trips').then((r) => r.data),
  get: (id: string) => client.get<Trip>(`/trips/${id}`).then((r) => r.data),
  create: (data: TripCreateForm) => client.post<Trip>('/trips', data).then((r) => r.data),
  update: (id: string, data: Partial<TripCreateForm>) => client.put<Trip>(`/trips/${id}`, data).then((r) => r.data),
  delete: (id: string) => client.delete(`/trips/${id}`),
  getSummary: (id: string) => client.get<TripSummary>(`/trips/${id}/summary`).then((r) => r.data),
  getBudget: (id: string) => client.get<BudgetInfo>(`/trips/${id}/budget`).then((r) => r.data),
}
