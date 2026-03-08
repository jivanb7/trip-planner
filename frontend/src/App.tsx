import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { AppShell } from '@/components/layout/AppShell'
import { Dashboard } from '@/pages/Dashboard'
import { TripCreate } from '@/pages/TripCreate'
import { TripDetail } from '@/pages/trip-detail/TripDetail'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 2,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <Routes>
              <Route element={<AppShell />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/trips/new" element={<TripCreate />} />
                <Route path="/trips/:id" element={<TripDetail />} />
              </Route>
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  )
}
