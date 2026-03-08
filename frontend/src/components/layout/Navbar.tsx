import { Link, useLocation } from 'react-router-dom'
import { Plane, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { to: '/', label: 'Dashboard' },
]

export function Navbar() {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
            <Plane className="size-5 text-primary" />
            <span>Trip Planner</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-foreground/80',
                  location.pathname === link.to
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <Link to="/trips/new">
          <Button size="sm">
            <Plus className="size-4" />
            New Trip
          </Button>
        </Link>
      </div>
    </header>
  )
}
