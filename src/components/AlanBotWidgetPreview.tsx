"use client";

export default function AlanBotWidgetPreview({ prompt }: { prompt: string }) {
  return (
    <div className="bg-smokyBlack p-6 rounded-xl text-center space-y-4 border border-border">
      <p className="text-text text-lg">{prompt}</p>
      <input
        type="text"
        placeholder="Try it now..."
        className="w-full px-4 py-2 border border-text-muted rounded-md bg-whiteOlive text-text placeholder:text-text-muted focus:ring-2 focus:ring-tekhelet focus:outline-none"
      />
    </div>
  );
}