import { useParams, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { useTrip } from '@/hooks/useTrips'
import { TripHeader } from './components/TripHeader'
import { OverviewTab } from './tabs/OverviewTab'
import { ActivitiesTab } from './tabs/ActivitiesTab'
import { LogisticsTab } from './tabs/LogisticsTab'
import { BudgetTab } from './tabs/BudgetTab'
import { ItineraryTab } from './tabs/ItineraryTab'
import { MapTab } from './tabs/MapTab'
import { TravelInfoTab } from './tabs/TravelInfoTab'
import { PackingTab } from './tabs/PackingTab'
import { WeatherTab } from './tabs/WeatherTab'
import { AlertTriangle } from 'lucide-react'

const tabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'activities', label: 'Activities' },
  { value: 'logistics', label: 'Logistics' },
  { value: 'budget', label: 'Budget' },
  { value: 'itinerary', label: 'Itinerary' },
  { value: 'map', label: 'Map' },
  { value: 'travel-info', label: 'Travel Info' },
  { value: 'packing', label: 'Packing' },
  { value: 'weather', label: 'Weather' },
]

const fadeVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
}

export function TripDetail() {
  const { id } = useParams<{ id: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'overview'
  const { data: trip, isLoading, error } = useTrip(id!)

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>
        <LoadingSpinner className="py-16" text="Loading trip details..." />
      </div>
    )
  }

  if (error || !trip) {
    return (
      <EmptyState
        icon={<AlertTriangle className="size-12" />}
        title="Trip not found"
        description="The trip you're looking for doesn't exist or has been removed."
      />
    )
  }

  return (
    <div className="space-y-6">
      <TripHeader trip={trip} />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="flex flex-wrap h-auto gap-1">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="text-sm">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mt-6"
          >
            <TabsContent value="overview" className="mt-0">
              <OverviewTab tripId={id!} trip={trip} />
            </TabsContent>
            <TabsContent value="activities" className="mt-0">
              <ActivitiesTab tripId={id!} />
            </TabsContent>
            <TabsContent value="logistics" className="mt-0">
              <LogisticsTab tripId={id!} />
            </TabsContent>
            <TabsContent value="budget" className="mt-0">
              <BudgetTab tripId={id!} currency={trip.currency} budget={trip.budget ?? null} />
            </TabsContent>
            <TabsContent value="itinerary" className="mt-0">
              <ItineraryTab tripId={id!} trip={trip} />
            </TabsContent>
            <TabsContent value="map" className="mt-0">
              <MapTab tripId={id!} />
            </TabsContent>
            <TabsContent value="travel-info" className="mt-0">
              <TravelInfoTab tripId={id!} />
            </TabsContent>
            <TabsContent value="packing" className="mt-0">
              <PackingTab tripId={id!} />
            </TabsContent>
            <TabsContent value="weather" className="mt-0">
              <WeatherTab tripId={id!} />
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  )
}
