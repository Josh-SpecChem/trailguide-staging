// /components/EventCard.tsx
import { CalendarDays } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function EventCard({ event }: { event: any }) {
  return (
    <Card className="p-4 space-y-4 bg-smokyBlack border border-border text-text">
      <CardContent>
        <h3 className="text-lg font-semibold text-tekhelet">{event.topic}</h3>
        <p className="text-sm text-text-muted">{event.description}</p>
        <div className="flex items-center gap-2 text-sm text-text-muted mt-2">
          <CalendarDays className="w-4 h-4 text-platinum" />
          <span>{event.date}</span>
        </div>
        <Button className="mt-4 w-full" asChild>
          <a href={event.link} target="_blank" rel="noopener noreferrer">Register</a>
        </Button>
      </CardContent>
    </Card>
  );
}