export interface Trip {
  id: string
  name: string
  destination: string
  start_date: string | null
  end_date: string | null
  description: string | null
  budget: number | null
  currency: string
  status: TripStatus
  created_at: string
  updated_at: string
}

export type TripStatus = 'planning' | 'active' | 'completed' | 'cancelled'

export interface Activity {
  id: string
  trip_id: string
  name: string
  description: string | null
  category: string | null
  date: string | null
  start_time: string | null
  end_time: string | null
  cost: number | null
  currency: string
  location: string | null
  latitude: number | null
  longitude: number | null
  booking_url: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type ActivityType = 'sightseeing' | 'food' | 'adventure' | 'shopping' | 'relaxation' | 'nightlife' | 'cultural' | 'transport' | 'other'

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
  type: string | null
  address: string | null
  latitude: number | null
  longitude: number | null
  check_in: string | null
  check_out: string | null
  cost_per_night: number | null
  currency: string
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
  airline: string | null
  flight_number: string | null
  departure_airport: string
  arrival_airport: string
  departure_time: string | null
  arrival_time: string | null
  cost: number | null
  currency: string
  confirmation_number: string | null
  booking_url: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Transport {
  id: string
  trip_id: string
  type: string
  description: string | null
  from_location: string | null
  to_location: string | null
  departure_time: string | null
  arrival_time: string | null
  cost: number | null
  currency: string
  confirmation_number: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type TransportType = 'train' | 'bus' | 'taxi' | 'rideshare' | 'rental_car' | 'ferry' | 'subway' | 'other'

export interface ItineraryItem {
  id: string
  trip_id: string
  date: string
  start_time: string | null
  end_time: string | null
  title: string
  description: string | null
  location: string | null
  category: string | null
  sort_order: number
  cost: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type ItineraryItemType = 'activity' | 'transport' | 'meal' | 'rest' | 'free_time' | 'check_in' | 'check_out' | 'flight' | 'other'

export interface TravelInfo {
  id: string
  trip_id: string
  visa_requirements: string | null
  vaccination_info: string | null
  travel_insurance: string | null
  local_currency: string | null
  language: string | null
  timezone: string | null
  power_outlet: string | null
  emergency_numbers: Record<string, string> | null
  useful_phrases: Record<string, string> | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface WeatherInfo {
  id: string
  trip_id: string
  date: string
  condition: string | null
  high_temp: number | null
  low_temp: number | null
  humidity: number | null
  precipitation_chance: number | null
  wind_speed: number | null
  created_at: string
  updated_at: string
}

export interface PackingItem {
  id: string
  trip_id: string
  name: string
  category: string
  quantity: number
  packed: boolean
  created_at: string
  updated_at: string
}

export type PackingCategory = 'clothing' | 'toiletries' | 'electronics' | 'documents' | 'medication' | 'accessories' | 'footwear' | 'gear' | 'snacks' | 'other'

// API response types
export interface TripSummary {
  trip: Trip
  activity_count: number
  expense_count: number
  accommodation_count: number
  flight_count: number
  transport_count: number
  itinerary_item_count: number
  packing_item_count: number
  total_spent_usd: number
  budget_remaining_usd: number | null
}

export interface BudgetInfo {
  budget: number | null
  currency: string
  total_spent_usd: number
  budget_remaining_usd: number | null
}

export interface ExpenseCategorySummary {
  category: string
  total_usd: number
  count: number
}

export interface ExpenseSummary {
  categories: ExpenseCategorySummary[]
  grand_total_usd: number
}

// Form types
export interface TripCreateForm {
  name: string
  destination: string
  start_date: string
  end_date: string
  budget: number
  currency: string
  description: string
}

export interface ActivityCreateForm {
  name: string
  description: string
  category: string
  date: string
  start_time: string
  end_time: string
  cost: number | null
  currency: string
  location: string
  latitude: number | null
  longitude: number | null
  booking_url: string
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
