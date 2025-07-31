"use client";

export default function NewsletterSignup({ title }: { title: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto space-y-6">
      <h3 className="text-2xl font-semibold text-tekhelet">{title}</h3>
      <form className="flex flex-col sm:flex-row gap-4 justify-center">
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full sm:w-auto px-4 py-2 bg-smokyBlack text-text border border-border rounded-md shadow-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-tekhelet"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-tekhelet text-black font-medium rounded-md hover:bg-tekhelet/80"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}