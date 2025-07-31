// /components/ToolkitCategories.tsx
export function ToolkitCategories({ onSelect }: { onSelect: (category: string) => void }) {
  const categories = [
    "Worksheets",
    "Slide Decks",
    "Printable Diagrams",
    "Audio Clips",
    "Templates",
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className="bg-whiteOlive hover:bg-whiteOlive/80 text-text text-sm px-4 py-2 rounded-full"
        >
          {cat}
        </button>
      ))}
    </div>
  );
}