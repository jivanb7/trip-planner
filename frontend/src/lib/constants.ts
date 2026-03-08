import type { TripType, TripStatus, ActivityType, DifficultyLevel, ExpenseCategory, AccommodationType, TransportType, ItineraryItemType, PackingCategory } from '@/types'

export const TRIP_TYPE_LABELS: Record<TripType, string> = {
  leisure: 'Leisure',
  business: 'Business',
  adventure: 'Adventure',
  cultural: 'Cultural',
  romantic: 'Romantic',
  family: 'Family',
  solo: 'Solo',
  group: 'Group',
}

export const TRIP_STATUS_LABELS: Record<TripStatus, string> = {
  planning: 'Planning',
  booked: 'Booked',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export const TRIP_STATUS_COLORS: Record<TripStatus, string> = {
  planning: 'bg-blue-100 text-blue-800',
  booked: 'bg-green-100 text-green-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
}

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  sightseeing: 'Sightseeing',
  dining: 'Dining',
  shopping: 'Shopping',
  entertainment: 'Entertainment',
  outdoor: 'Outdoor',
  cultural: 'Cultural',
  relaxation: 'Relaxation',
  nightlife: 'Nightlife',
  sports: 'Sports',
  other: 'Other',
}

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  easy: 'Easy',
  moderate: 'Moderate',
  challenging: 'Challenging',
  extreme: 'Extreme',
}

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  flights: 'Flights',
  accommodation: 'Accommodation',
  transport: 'Transport',
  food: 'Food & Dining',
  activities: 'Activities',
  shopping: 'Shopping',
  insurance: 'Insurance',
  visa: 'Visa & Fees',
  communication: 'Communication',
  other: 'Other',
}

export const EXPENSE_CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  flights: '#3b82f6',
  accommodation: '#8b5cf6',
  transport: '#f59e0b',
  food: '#ef4444',
  activities: '#10b981',
  shopping: '#ec4899',
  insurance: '#6b7280',
  visa: '#06b6d4',
  communication: '#84cc16',
  other: '#9ca3af',
}

export const ACCOMMODATION_TYPE_LABELS: Record<AccommodationType, string> = {
  hotel: 'Hotel',
  hostel: 'Hostel',
  airbnb: 'Airbnb',
  resort: 'Resort',
  apartment: 'Apartment',
  guesthouse: 'Guesthouse',
  camping: 'Camping',
  other: 'Other',
}

export const TRANSPORT_TYPE_LABELS: Record<TransportType, string> = {
  train: 'Train',
  bus: 'Bus',
  taxi: 'Taxi',
  uber: 'Uber/Ride Share',
  rental_car: 'Rental Car',
  ferry: 'Ferry',
  subway: 'Subway/Metro',
  tram: 'Tram',
  bike: 'Bike',
  walking: 'Walking',
  other: 'Other',
}

export const ITINERARY_ITEM_TYPE_LABELS: Record<ItineraryItemType, string> = {
  activity: 'Activity',
  transport: 'Transport',
  meal: 'Meal',
  rest: 'Rest',
  free_time: 'Free Time',
  check_in: 'Check In',
  check_out: 'Check Out',
  flight: 'Flight',
  other: 'Other',
}

export const PACKING_CATEGORY_LABELS: Record<PackingCategory, string> = {
  clothing: 'Clothing',
  toiletries: 'Toiletries',
  electronics: 'Electronics',
  documents: 'Documents',
  medication: 'Medication',
  accessories: 'Accessories',
  footwear: 'Footwear',
  gear: 'Gear',
  snacks: 'Snacks',
  other: 'Other',
}

export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '\u20ac' },
  { code: 'GBP', name: 'British Pound', symbol: '\u00a3' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '\u00a5' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '\u00a5' },
  { code: 'INR', name: 'Indian Rupee', symbol: '\u20b9' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'KRW', name: 'South Korean Won', symbol: '\u20a9' },
  { code: 'THB', name: 'Thai Baht', symbol: '\u0e3f' },
]
