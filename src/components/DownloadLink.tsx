// components/DownloadLink.tsx
export default function DownloadLink({ url }: { url: string }) {
  return (
    <div className="mt-6">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-4 py-2 bg-amaranthPurple text-black rounded border border-border hover:bg-amaranthPurple/90"
      >
        Download Tool
      </a>
    </div>
  );
}