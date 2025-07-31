// /components/ContactForm.tsx
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export function ContactForm() {
  return (
    <form className="space-y-4 max-w-xl mx-auto text-text">
      <Input
        type="text"
        placeholder="Your name"
        required
        className="bg-whiteOlive text-text border border-border placeholder:text-text-muted"
      />
      <Input
        type="email"
        placeholder="Your email"
        required
        className="bg-whiteOlive text-text border border-border placeholder:text-text-muted"
      />
      <Textarea
        placeholder="How can we collaborate?"
        rows={5}
        required
        className="bg-whiteOlive text-text border border-border placeholder:text-text-muted"
      />
      <Button type="submit" className="w-full">Send Message</Button>
    </form>
  );
}