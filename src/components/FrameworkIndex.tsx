// components/FrameworkIndex.tsx
import Link from "next/link";

const frameworks = [
  {
    slug: "apest",
    title: "APEST Intelligence",
    summary: "Rediscover the fivefold typology from Ephesians 4 as a distributed intelligence for movement leadership."
  },
  {
    slug: "mdna",
    title: "The Forgotten Ways / mDNA",
    summary: "Explore the missional DNA that catalyzes apostolic movements across time and culture."
  },
  {
    slug: "liminality-communitas",
    title: "Liminality & Communitas",
    summary: "Learn how risk and edge environments shape transformational communities."
  },
  {
    slug: "christology-missiology-ecclesiology",
    title: "Christology → Missiology → Ecclesiology",
    summary: "A theological flow that re-centers Jesus and reorders our ecclesial imagination."
  },
  {
    slug: "movement-vs-institution",
    title: "Movement vs. Institution",
    summary: "Contrast the dynamics of living movements with the patterns of static institutions."
  }
];

export default function FrameworkIndex() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {frameworks.map(({ slug, title, summary }) => (
        <Link
          key={slug}
          href={`/frameworks/${slug}`}
          className="block p-6 bg-smokyBlack border border-border rounded-xl shadow hover:shadow-lg hover:border-tekhelet transition text-text"
        >
          <h2 className="text-2xl font-bold mb-2 text-tekhelet">{title}</h2>
          <p className="text-text-muted text-base">{summary}</p>
        </Link>
      ))}
    </div>
  );
}