import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Plus, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { ExpenseRow } from '../components/ExpenseRow'
import { useExpenses, useExpenseSummary, useCreateExpense, useDeleteExpense } from '@/hooks/useExpenses'
import { useTripBudget } from '@/hooks/useTrips'
import { EXPENSE_CATEGORY_LABELS, EXPENSE_CATEGORY_COLORS } from '@/lib/constants'
import { formatCurrency, getPercentage } from '@/lib/formatters'
import type { ExpenseCategory } from '@/types'

interface BudgetTabProps {
  tripId: string
  currency: string
  budget: number | null
}

export function BudgetTab({ tripId, currency, budget }: BudgetTabProps) {
  const { data: expenses, isLoading } = useExpenses(tripId)
  const { data: budgetInfo } = useTripBudget(tripId)
  const { data: summary } = useExpenseSummary(tripId)
  const createExpense = useCreateExpense(tripId)
  const deleteExpense = useDeleteExpense(tripId)

  const [showForm, setShowForm] = useState(false)
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'other' as ExpenseCategory,
  })

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount) return
    createExpense.mutate(
      {
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        currency,
        category: newExpense.category,
        date: new Date().toISOString().split('T')[0],
        notes: '',
      },
      {
        onSuccess: () => {
          setNewExpense({ description: '', amount: '', category: 'other' })
          setShowForm(false)
        },
      }
    )
  }

  const chartData = summary?.categories
    ? summary.categories
        .filter((c) => c.total_usd > 0)
        .map((c) => ({
          name: EXPENSE_CATEGORY_LABELS[c.category as ExpenseCategory] ?? c.category,
          value: c.total_usd,
          color: EXPENSE_CATEGORY_COLORS[c.category as ExpenseCategory] ?? '#9ca3af',
        }))
    : []

  const totalSpent = budgetInfo?.total_spent_usd ?? 0
  const remaining = budgetInfo?.budget_remaining_usd ?? budget
  const percentage = getPercentage(totalSpent, budget ?? 0)

  if (isLoading) return <LoadingSpinner className="py-16" text="Loading budget..." />

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Budget</p>
            <p className="text-2xl font-bold">{budget != null ? formatCurrency(budget, currency) : 'Not set'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Spent</p>
            <p className="text-2xl font-bold">{formatCurrency(totalSpent, currency)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className={`text-2xl font-bold ${remaining != null && remaining < 0 ? 'text-destructive' : ''}`}>
              {remaining != null ? formatCurrency(remaining, currency) : 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Progress value={percentage} className="h-3" />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart */}
        {chartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value), currency)}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Expense List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)}>
              <Plus className="size-4" />
              Add
            </Button>
          </CardHeader>
          <CardContent>
            {showForm && (
              <div className="space-y-3 mb-4 p-3 border rounded-lg bg-muted/30">
                <div className="space-y-2">
                  <Label htmlFor="expense-desc">Description</Label>
                  <Input
                    id="expense-desc"
                    placeholder="What did you spend on?"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="expense-amount">Amount</Label>
                    <Input
                      id="expense-amount"
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="0.00"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={newExpense.category}
                      onValueChange={(val) => setNewExpense({ ...newExpense, category: val as ExpenseCategory })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(EXPENSE_CATEGORY_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddExpense} disabled={createExpense.isPending}>
                    {createExpense.isPending ? 'Adding...' : 'Add Expense'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {expenses && expenses.length > 0 ? (
              <div>
                {expenses.map((expense) => (
                  <ExpenseRow
                    key={expense.id}
                    expense={expense}
                    onDelete={(id) => deleteExpense.mutate(id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<TrendingDown className="size-8" />}
                title="No expenses yet"
                description="Track your spending by adding expenses."
                className="py-8"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
