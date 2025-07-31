// components/AudioOverview.tsx
export default function AudioOverview({ url }: { url: string }) {
  return (
    <div className="mt-8 bg-whiteOlive p-4 rounded-lg text-text">
      <h2 className="text-xl font-semibold mb-2">Audio Overview</h2>
      <audio controls className="w-full">
        <source src={url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}