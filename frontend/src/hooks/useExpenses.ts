import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { expensesApi } from '@/api/endpoints/expenses'
import type { ExpenseCreateForm } from '@/types'
import { toast } from 'sonner'

export function useExpenses(tripId: string) {
  return useQuery({
    queryKey: ['trips', tripId, 'expenses'],
    queryFn: () => expensesApi.list(tripId),
    enabled: !!tripId,
  })
}

export function useExpenseSummary(tripId: string) {
  return useQuery({
    queryKey: ['trips', tripId, 'expenses', 'summary'],
    queryFn: () => expensesApi.getSummary(tripId),
    enabled: !!tripId,
  })
}

export function useCreateExpense(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<ExpenseCreateForm>) => expensesApi.create(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'expenses'] })
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'budget'] })
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'summary'] })
      toast.success('Expense added!')
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to add expense')
    },
  })
}

export function useUpdateExpense(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ExpenseCreateForm> }) => expensesApi.update(tripId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'expenses'] })
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'budget'] })
      toast.success('Expense updated!')
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to update expense')
    },
  })
}

export function useDeleteExpense(tripId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => expensesApi.delete(tripId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'expenses'] })
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'budget'] })
      queryClient.invalidateQueries({ queryKey: ['trips', tripId, 'summary'] })
      toast.success('Expense removed!')
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || 'Failed to remove expense')
    },
  })
}
