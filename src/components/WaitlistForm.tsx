import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function WaitlistForm() {
  return (
    <div className="bg-smokyBlack border border-border rounded-xl p-6 shadow-sm space-y-4 text-text">
      <h3 className="text-xl font-semibold text-tekhelet">Join the Waitlist</h3>
      <p className="text-sm text-text-muted">Be notified when new cohorts, courses, or intensives launch.</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Your email"
          className="flex-1 bg-whiteOlive text-text border border-border placeholder:text-text-muted"
        />
        <Button className="w-full sm:w-auto">Join</Button>
      </div>
    </div>
  );
}