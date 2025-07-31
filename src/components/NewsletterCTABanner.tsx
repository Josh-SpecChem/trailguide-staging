// /components/NewsletterCTABanner.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterCTABanner() {
  return (
    <div className="bg-whiteOlive rounded-xl p-6 text-center space-y-4 mt-12 text-text">
      <h2 className="text-2xl font-semibold text-tekhelet">Subscribe to Letters from the Edge</h2>
      <p className="text-text-muted">Get Alan’s latest essays and field notes direct to your inbox.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
        <Input
          type="email"
          placeholder="Your email"
          className="flex-1 bg-smokyBlack text-text border border-border placeholder:text-text-muted"
        />
        <Button>Subscribe</Button>
      </div>
    </div>
  );
}