"use client";

const frameworks = [
  { title: "APEST", description: "Apostolic intelligence for the whole church." },
  { title: "mDNA", description: "Missional DNA found in every vibrant Jesus movement." },
  { title: "Liminality & Communitas", description: "How risk and edge-experience shape true community." },
  { title: "Movement Thinking", description: "From institutional preservation to decentralized impact." },
];

export default function FrameworksPreview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {frameworks.map((fw, i) => (
        <div
          key={i}
          className="p-6 border border-border rounded-xl bg-smokyBlack shadow hover:shadow-lg transition text-text"
        >
          <h3 className="text-lg font-semibold text-tekhelet mb-2">{fw.title}</h3>
          <p className="text-sm text-text-muted">{fw.description}</p>
        </div>
      ))}
    </div>
  );
}