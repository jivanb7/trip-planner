import { Shield, Globe, Languages, Plug, Phone } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
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
    <Accordion type="multiple" defaultValue={['visa', 'currency', 'language', 'electrical', 'emergency']} className="space-y-2">
      {/* Visa & Entry */}
      <AccordionItem value="visa" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-2">
            <Shield className="size-4" />
            <span>Visa & Entry Requirements</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 pb-2">
            {info.visa_requirements ? (
              <p className="text-sm text-muted-foreground">{info.visa_requirements}</p>
            ) : (
              <p className="text-sm text-muted-foreground">No visa information provided.</p>
            )}
            {info.vaccination_info && (
              <div>
                <span className="text-sm font-medium">Vaccination Info: </span>
                <p className="text-sm text-muted-foreground">{info.vaccination_info}</p>
              </div>
            )}
            {info.travel_insurance && (
              <div>
                <span className="text-sm font-medium">Travel Insurance: </span>
                <p className="text-sm text-muted-foreground">{info.travel_insurance}</p>
              </div>
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
            {info.local_currency ? (
              <div>
                <span className="text-sm text-muted-foreground">Local Currency: </span>
                <span className="text-sm font-medium">{info.local_currency}</span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No currency information provided.</p>
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
            {info.timezone && (
              <div>
                <span className="text-sm text-muted-foreground">Timezone: </span>
                <span className="text-sm">{info.timezone}</span>
              </div>
            )}
            {info.useful_phrases && Object.keys(info.useful_phrases).length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Phrase</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Translation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(info.useful_phrases).map(([phrase, translation]) => (
                      <tr key={phrase} className="border-b last:border-0">
                        <td className="py-2 pr-4">{phrase}</td>
                        <td className="py-2 font-medium">{translation}</td>
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
            {info.power_outlet ? (
              <div>
                <span className="text-sm text-muted-foreground">Power Outlet: </span>
                <span className="text-sm">{info.power_outlet}</span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No electrical information provided.</p>
            )}
            {info.notes && (
              <div>
                <span className="text-sm font-medium">Notes: </span>
                <p className="text-sm text-muted-foreground">{info.notes}</p>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Emergency Numbers */}
      <AccordionItem value="emergency" className="border rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-2">
            <Phone className="size-4" />
            <span>Emergency Numbers</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 pb-2">
            {info.emergency_numbers && Object.keys(info.emergency_numbers).length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(info.emergency_numbers).map(([label, number]) => (
                  <div key={label} className="text-sm">
                    <span className="text-muted-foreground capitalize">{label}: </span>
                    <span className="font-medium">{number}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No emergency numbers provided.</p>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
