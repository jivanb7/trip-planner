import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { useActivities } from '@/hooks/useActivities'
import { useAccommodations } from '@/hooks/useAccommodations'

interface MapTabProps {
  tripId: string
}

// Lazy load Leaflet to avoid SSR issues
function LeafletMap({ markers }: { markers: Array<{ lat: number; lng: number; title: string; type: 'activity' | 'accommodation' }> }) {
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: typeof import('react-leaflet').MapContainer
    TileLayer: typeof import('react-leaflet').TileLayer
    Marker: typeof import('react-leaflet').Marker
    Popup: typeof import('react-leaflet').Popup
  } | null>(null)

  useEffect(() => {
    // Dynamic import for leaflet CSS and components
    import('leaflet/dist/leaflet.css')
    Promise.all([
      import('react-leaflet'),
      import('leaflet'),
    ]).then(([rl, L]) => {
      // Fix default marker icons
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })
      setMapComponents({
        MapContainer: rl.MapContainer,
        TileLayer: rl.TileLayer,
        Marker: rl.Marker,
        Popup: rl.Popup,
      })
    })
  }, [])

  if (!MapComponents) return <LoadingSpinner className="py-16" text="Loading map..." />

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents

  const center = markers.length > 0
    ? { lat: markers[0].lat, lng: markers[0].lng }
    : { lat: 48.8566, lng: 2.3522 }

  return (
    <div className="h-[500px] rounded-lg overflow-hidden border">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker, i) => (
          <Marker key={i} position={[marker.lat, marker.lng]}>
            <Popup>
              <div>
                <strong>{marker.title}</strong>
                <br />
                <span className="text-xs capitalize">{marker.type}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export function MapTab({ tripId }: MapTabProps) {
  const { data: activities, isLoading: activitiesLoading } = useActivities(tripId)
  const { data: accommodations, isLoading: accommodationsLoading } = useAccommodations(tripId)

  if (activitiesLoading || accommodationsLoading) {
    return <LoadingSpinner className="py-16" text="Loading map data..." />
  }

  const markers: Array<{ lat: number; lng: number; title: string; type: 'activity' | 'accommodation' }> = []

  activities?.forEach((a) => {
    if (a.latitude != null && a.longitude != null) {
      markers.push({ lat: a.latitude, lng: a.longitude, title: a.name, type: 'activity' })
    }
  })

  accommodations?.forEach((a) => {
    if (a.latitude != null && a.longitude != null) {
      markers.push({ lat: a.latitude, lng: a.longitude, title: a.name, type: 'accommodation' })
    }
  })

  if (markers.length === 0) {
    return (
      <EmptyState
        icon={<MapPin className="size-12" />}
        title="No locations to display"
        description="Activities and accommodations with coordinates will appear on the map."
      />
    )
  }

  return <LeafletMap markers={markers} />
}
