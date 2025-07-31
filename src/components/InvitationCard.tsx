// /components/InvitationCard.tsx
import { Button } from '@/components/ui/button';

export function InvitationCard() {
  return (
    <section className="bg-smokyBlack border border-border rounded-xl p-6 text-center space-y-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold text-tekhelet">Step Into the Story</h2>
      <p className="text-text-muted">
        Whether it’s speaking, collaboration, or coaching, this is a space for shared mission.
      </p>
      <Button asChild>
        <a href="/contact">Request to Connect</a>
      </Button>
    </section>
  );
}