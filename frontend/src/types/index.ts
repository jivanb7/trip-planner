export interface Trip {
  id: string
  destination: string
  country: string
  start_date: string
  end_date: string
  budget: number
  currency: string
  trip_type: TripType
  status: TripStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export type TripType = 'leisure' | 'business' | 'adventure' | 'cultural' | 'romantic' | 'family' | 'solo' | 'group'
export type TripStatus = 'planning' | 'booked' | 'in_progress' | 'completed' | 'cancelled'

export interface Activity {
  id: string
  trip_id: string
  name: string
  description: string | null
  activity_type: ActivityType
  date: string | null
  start_time: string | null
  end_time: string | null
  duration_minutes: number | null
  cost: number | null
  currency: string | null
  cost_usd: number | null
  location: string | null
  latitude: number | null
  longitude: number | null
  booking_url: string | null
  difficulty: DifficultyLevel | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type ActivityType = 'sightseeing' | 'dining' | 'shopping' | 'entertainment' | 'outdoor' | 'cultural' | 'relaxation' | 'nightlife' | 'sports' | 'other'
export type DifficultyLevel = 'easy' | 'moderate' | 'challenging' | 'extreme'

export interface Expense {
  id: string
  trip_id: string
  description: string
  amount: number
  currency: string
  amount_usd: number
  category: ExpenseCategory
  date: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type ExpenseCategory = 'flights' | 'accommodation' | 'transport' | 'food' | 'activities' | 'shopping' | 'insurance' | 'visa' | 'communication' | 'other'

export interface Accommodation {
  id: string
  trip_id: string
  name: string
  accommodation_type: AccommodationType
  address: string | null
  latitude: number | null
  longitude: number | null
  check_in: string
  check_out: string
  cost_per_night: number | null
  currency: string | null
  total_cost: number | null
  total_cost_usd: number | null
  booking_url: string | null
  confirmation_number: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type AccommodationType = 'hotel' | 'hostel' | 'airbnb' | 'resort' | 'apartment' | 'guesthouse' | 'camping' | 'other'

export interface Flight {
  id: string
  trip_id: string
  airline: string
  flight_number: string
  departure_airport: string
  arrival_airport: string
  departure_time: string
  arrival_time: string
  cost: number | null
  currency: string | null
  cost_usd: number | null
  booking_reference: string | null
  seat: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Transport {
  id: string
  trip_id: string
  transport_type: TransportType
  from_location: string
  to_location: string
  departure_time: string | null
  arrival_time: string | null
  cost: number | null
  currency: string | null
  cost_usd: number | null
  booking_reference: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type TransportType = 'train' | 'bus' | 'taxi' | 'uber' | 'rental_car' | 'ferry' | 'subway' | 'tram' | 'bike' | 'walking' | 'other'

export interface ItineraryItem {
  id: string
  trip_id: string
  day_number: number
  position: number
  title: string
  description: string | null
  start_time: string | null
  end_time: string | null
  location: string | null
  item_type: ItineraryItemType
  linked_activity_id: string | null
  linked_transport_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type ItineraryItemType = 'activity' | 'transport' | 'meal' | 'rest' | 'free_time' | 'check_in' | 'check_out' | 'flight' | 'other'

export interface TravelInfo {
  id: string
  trip_id: string
  visa_required: boolean | null
  visa_type: string | null
  visa_notes: string | null
  local_currency: string | null
  exchange_rate: number | null
  language: string | null
  useful_phrases: UsefulPhrase[] | null
  plug_type: string | null
  voltage: string | null
  emergency_numbers: EmergencyNumbers | null
  safety_rating: string | null
  safety_notes: string | null
  created_at: string
  updated_at: string
}

export interface UsefulPhrase {
  phrase: string
  translation: string
}

export interface EmergencyNumbers {
  police: string | null
  ambulance: string | null
  fire: string | null
  tourist_police: string | null
}

export interface WeatherInfo {
  id: string
  trip_id: string
  date: string
  condition: string
  temperature_high: number
  temperature_low: number
  humidity: number | null
  rain_chance: number | null
  uv_index: number | null
  wind_speed: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface PackingItem {
  id: string
  trip_id: string
  name: string
  category: PackingCategory
  quantity: number
  is_packed: boolean
  is_essential: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export type PackingCategory = 'clothing' | 'toiletries' | 'electronics' | 'documents' | 'medication' | 'accessories' | 'footwear' | 'gear' | 'snacks' | 'other'

// API response types
export interface TripSummary extends Trip {
  activity_count: number
  expense_count: number
  accommodation_count: number
  flight_count: number
  total_spent: number
  budget_remaining: number
}

export interface BudgetInfo {
  budget: number
  total_spent: number
  remaining: number
  currency: string
}

export interface ExpenseSummary {
  by_category: Record<ExpenseCategory, number>
  total: number
  currency: string
}

// Form types
export interface TripCreateForm {
  destination: string
  country: string
  start_date: string
  end_date: string
  budget: number
  currency: string
  trip_type: TripType
  notes: string
}

export interface ActivityCreateForm {
  name: string
  description: string
  activity_type: ActivityType
  date: string
  start_time: string
  end_time: string
  duration_minutes: number | null
  cost: number | null
  currency: string
  location: string
  latitude: number | null
  longitude: number | null
  booking_url: string
  difficulty: DifficultyLevel | null
  notes: string
}

export interface ExpenseCreateForm {
  description: string
  amount: number
  currency: string
  category: ExpenseCategory
  date: string
  notes: string
}
