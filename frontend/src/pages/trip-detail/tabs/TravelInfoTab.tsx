import { Shield, Globe, Languages, Plug, Phone, AlertTriangle } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { useTravelInfo } from '@/hooks/useTravelInfo'

interface TravelInfoTabProps {
  tripId: string
}

export function TravelInfoTab({ tripId }: TravelInfoTabProps) {
  const { data: info, isLoading, error } = useTravelInfo(tripId)

  if (isLoading) return <LoadingSpinner className="py-16" text="Loading travel info..." />

  if (error || !info) {
    return (
      <EmptyState
        icon={<Globe className="size-12" />}
        title="No travel info yet"
        description="Travel information will be shown here once added via the API or Claude."
      />
    )
  }

  return (
    <Accordion type="multiple" defaultValue={['visa', 'currency', 'language', 'electrical', 'safety']} className="space-y-2">
      {/* Visa & Passport */}
      <AccordionItem value="visa" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-2">
            <Shield className="size-4" />
            <span>Visa & Passport</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Visa Required:</span>
              <Badge variant={info.visa_required ? 'destructive' : 'secondary'}>
                {info.visa_required ? 'Yes' : 'No'}
              </Badge>
            </div>
            {info.visa_type && (
              <div>
                <span className="text-sm text-muted-foreground">Visa Type: </span>
                <span className="text-sm">{info.visa_type}</span>
              </div>
            )}
            {info.visa_notes && (
              <p className="text-sm text-muted-foreground">{info.visa_notes}</p>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Currency */}
      <AccordionItem value="currency" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-2">
            <Globe className="size-4" />
            <span>Currency</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 pb-2">
            {info.local_currency && (
              <div>
                <span className="text-sm text-muted-foreground">Local Currency: </span>
                <span className="text-sm font-medium">{info.local_currency}</span>
              </div>
            )}
            {info.exchange_rate && (
              <div>
                <span className="text-sm text-muted-foreground">Exchange Rate: </span>
                <span className="text-sm">1 USD = {info.exchange_rate} {info.local_currency}</span>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Language */}
      <AccordionItem value="language" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-2">
            <Languages className="size-4" />
            <span>Language</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 pb-2">
            {info.language && (
              <div>
                <span className="text-sm text-muted-foreground">Primary Language: </span>
                <span className="text-sm font-medium">{info.language}</span>
              </div>
            )}
            {info.useful_phrases && info.useful_phrases.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Phrase</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Translation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {info.useful_phrases.map((phrase, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2 pr-4">{phrase.phrase}</td>
                        <td className="py-2 font-medium">{phrase.translation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Electrical & Practical */}
      <AccordionItem value="electrical" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-2">
            <Plug className="size-4" />
            <span>Electrical & Practical</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 pb-2">
            {info.plug_type && (
              <div>
                <span className="text-sm text-muted-foreground">Plug Type: </span>
                <span className="text-sm">{info.plug_type}</span>
              </div>
            )}
            {info.voltage && (
              <div>
                <span className="text-sm text-muted-foreground">Voltage: </span>
                <span className="text-sm">{info.voltage}</span>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Safety & Emergency */}
      <AccordionItem value="safety" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-2">
            <Phone className="size-4" />
            <span>Safety & Emergency</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 pb-2">
            {info.safety_rating && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Safety Rating: </span>
                <Badge variant="secondary">{info.safety_rating}</Badge>
              </div>
            )}
            {info.safety_notes && (
              <div className="flex items-start gap-2">
                <AlertTriangle className="size-4 mt-0.5 text-amber-500" />
                <p className="text-sm">{info.safety_notes}</p>
              </div>
            )}
            {info.emergency_numbers && (
              <div className="grid grid-cols-2 gap-2">
                {info.emergency_numbers.police && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Police: </span>
                    <span className="font-medium">{info.emergency_numbers.police}</span>
                  </div>
                )}
                {info.emergency_numbers.ambulance && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Ambulance: </span>
                    <span className="font-medium">{info.emergency_numbers.ambulance}</span>
                  </div>
                )}
                {info.emergency_numbers.fire && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Fire: </span>
                    <span className="font-medium">{info.emergency_numbers.fire}</span>
                  </div>
                )}
                {info.emergency_numbers.tourist_police && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Tourist Police: </span>
                    <span className="font-medium">{info.emergency_numbers.tourist_police}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
