import HeroBanner from "@/components/HeroBanner";
import IntroBlock from "@/components/IntroBlock";
import FrameworksPreview from "@/components/FrameworksPreview";
import ContentFeed from "@/components/ContentFeed";
import NewsletterSignup from "@/components/NewsletterSignup";
import AlanBotWidgetPreview from "@/components/AlanBotWidgetPreview";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="bg-smokyBlack text-text">
      {/* Hero Section */}
      <section className="relative z-10">
        <HeroBanner
          title="Reactivating the Church as Movement"
          ctas={[
            { label: "Explore the Frameworks", href: "/frameworks" },
            { label: "Talk to the AlanBot", href: "/alanbot" },
          ]}
        />
      </section>

      {/* Mini-Intro / Positioning Block */}
      <section className="py-16 px-6 md:px-12 max-w-5xl mx-auto">
        <IntroBlock
          introText="Alan Hirsch is a missional catalyst and movement thinker helping reawaken the church’s original DNA."
          videoUrl="https://www.youtube.com/embed/SAMPLE"
        />
      </section>

      {/* Frameworks Preview */}
      <section className="py-12 px-6 md:px-12 max-w-6xl mx-auto">
        <FrameworksPreview />
      </section>

      {/* Featured Content Feed */}
      <section className="py-12 px-6 md:px-12 max-w-6xl mx-auto">
        <ContentFeed limit={4} />
      </section>

      {/* Newsletter Invite */}
      <section className="py-16 px-6 md:px-12 bg-whiteOlive">
        <NewsletterSignup title="Letters from the Edge of the Church" />
      </section>

      {/* AlanBot Teaser */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <AlanBotWidgetPreview prompt="Ask Alan how to launch a microchurch…" />
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}