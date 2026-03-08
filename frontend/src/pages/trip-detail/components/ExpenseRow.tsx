import { Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EXPENSE_CATEGORY_LABELS } from '@/lib/constants'
import { formatCurrency, formatDate } from '@/lib/formatters'
import type { Expense } from '@/types'

interface ExpenseRowProps {
  expense: Expense
  onDelete?: (id: string) => void
}

export function ExpenseRow({ expense, onDelete }: ExpenseRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex items-center gap-3">
        <div className="space-y-0.5">
          <p className="font-medium text-sm">{expense.description}</p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {EXPENSE_CATEGORY_LABELS[expense.category]}
            </Badge>
            {expense.date && (
              <span className="text-xs text-muted-foreground">{formatDate(expense.date)}</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-right">
          <p className="font-semibold text-sm">{formatCurrency(expense.amount, expense.currency)}</p>
          {expense.currency !== 'USD' && (
            <p className="text-xs text-muted-foreground">{formatCurrency(expense.amount_usd, 'USD')}</p>
          )}
        </div>
        {onDelete && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onDelete(expense.id)}
            className="text-muted-foreground hover:text-destructive"
            aria-label="Delete expense"
          >
            <Trash2 className="size-3.5" />
          </Button>
        )}
      </div>
    </div>
  )
}
