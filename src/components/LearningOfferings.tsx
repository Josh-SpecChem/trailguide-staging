// /components/LearningOfferings.tsx
import { EventCard } from './EventCard';
import { CoursePromo } from './CoursePromo';
import { WaitlistForm } from './WaitlistForm';

export function LearningOfferings({ events, course }: { events: any[]; course: any }) {
  return (
    <div className="space-y-12 text-text">
      <CoursePromo course={course} />

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-tekhelet">Upcoming Events & Cohorts</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, idx) => (
            <EventCard key={idx} event={event} />
          ))}
        </div>
      </div>

      <WaitlistForm />
    </div>
  );
}