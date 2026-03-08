import client from '../client'
import type { Expense, ExpenseCreateForm, ExpenseSummary } from '@/types'

export const expensesApi = {
  list: (tripId: string) => client.get<Expense[]>(`/trips/${tripId}/expenses`).then((r) => r.data),
  get: (tripId: string, id: string) => client.get<Expense>(`/trips/${tripId}/expenses/${id}`).then((r) => r.data),
  create: (tripId: string, data: Partial<ExpenseCreateForm>) => client.post<Expense>(`/trips/${tripId}/expenses`, data).then((r) => r.data),
  update: (tripId: string, id: string, data: Partial<ExpenseCreateForm>) => client.put<Expense>(`/trips/${tripId}/expenses/${id}`, data).then((r) => r.data),
  delete: (tripId: string, id: string) => client.delete(`/trips/${tripId}/expenses/${id}`),
  getSummary: (tripId: string) => client.get<ExpenseSummary>(`/trips/${tripId}/expenses/summary`).then((r) => r.data),
}
