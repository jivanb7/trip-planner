import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PackingItem } from '@/types'

interface PackingCategoryGroupProps {
  category: string
  items: PackingItem[]
  onToggle: (id: string, isPacked: boolean) => void
  onDelete: (id: string) => void
}

export function PackingCategoryGroup({ category, items, onToggle, onDelete }: PackingCategoryGroupProps) {
  const packedCount = items.filter((i) => i.packed).length

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm capitalize">
          {category}
          <span className="text-xs text-muted-foreground ml-2">
            {packedCount}/{items.length}
          </span>
        </h4>
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/50 group"
          >
            <label className="flex items-center gap-2 cursor-pointer flex-1">
              <input
                type="checkbox"
                checked={item.packed}
                onChange={() => onToggle(item.id, !item.packed)}
                className="size-4 rounded border-input accent-primary"
              />
              <span className={`text-sm ${item.packed ? 'line-through text-muted-foreground' : ''}`}>
                {item.name}
                {item.quantity > 1 && (
                  <span className="text-xs text-muted-foreground ml-1">x{item.quantity}</span>
                )}
              </span>
            </label>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onDelete(item.id)}
              className="opacity-40 group-hover:opacity-100 focus-visible:opacity-100 text-muted-foreground hover:text-destructive"
              aria-label={`Delete ${item.name}`}
            >
              <Trash2 className="size-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
