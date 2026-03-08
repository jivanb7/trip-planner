import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, MapPin, Calendar, Wallet, Plane } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/shared/EmptyState'
import { useTrips } from '@/hooks/useTrips'
import { TRIP_STATUS_LABELS, TRIP_STATUS_COLORS } from '@/lib/constants'
import { formatDateRange, formatCurrency, getPercentage } from '@/lib/formatters'
import type { Trip } from '@/types'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
}

function TripCard({ trip }: { trip: Trip }) {
  const budgetUsed = 0 // Will be computed from summary endpoint when available
  const percentage = getPercentage(budgetUsed, trip.budget ?? 0)

  return (
    <motion.div variants={itemVariants}>
      <Link to={`/trips/${trip.id}`}>
        <Card className="group cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                  {trip.name}
                </h3>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" />
                  <span>{trip.destination}</span>
                </div>
              </div>
              <Badge
                variant="secondary"
                className={TRIP_STATUS_COLORS[trip.status] ?? ''}
              >
                {TRIP_STATUS_LABELS[trip.status] ?? trip.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                <span>{formatDateRange(trip.start_date ?? '', trip.end_date ?? '')}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Wallet className="size-3.5" />
                  <span>Budget</span>
                </div>
                <span className="font-medium">
                  {trip.budget != null ? formatCurrency(trip.budget, trip.currency) : 'Not set'}
                </span>
              </div>
              {trip.budget != null && <Progress value={percentage} className="h-1.5" />}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-1.5 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function Dashboard() {
  const { data: trips, isLoading, error } = useTrips()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Trips</h1>
          <p className="text-muted-foreground">
            Plan and manage your upcoming adventures
          </p>
        </div>
        <Link to="/trips/new">
          <Button>
            <Plus className="size-4" />
            New Trip
          </Button>
        </Link>
      </div>

      {isLoading && <DashboardSkeleton />}

      {error && (
        <EmptyState
          icon={<Plane className="size-12" />}
          title="Unable to load trips"
          description="Please check your connection and try again."
        />
      )}

      {trips && trips.length === 0 && (
        <EmptyState
          icon={<Plane className="size-12" />}
          title="No trips yet"
          description="Create your first trip to start planning your next adventure."
          action={
            <Link to="/trips/new">
              <Button>
                <Plus className="size-4" />
                Create your first trip
              </Button>
            </Link>
          }
        />
      )}

      {trips && trips.length > 0 && (
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </motion.div>
      )}
    </div>
  )
}
