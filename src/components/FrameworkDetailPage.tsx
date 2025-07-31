'use client';
import DownloadLink from "@/components/DownloadLink";
import AudioOverview from "@/components/AudioOverview";


export default function FrameworkDetailPage({
  title,
  essay,
  Illustration,
  downloadUrl,
  audioUrl
}: {
  title: string;
  essay: string;
  Illustration: React.ReactNode;
  downloadUrl?: string;
  audioUrl?: string;
}) {
  return (
    <article className="py-16 px-6 md:px-12 max-w-5xl mx-auto text-text bg-smokyBlack">
      <h1 className="text-4xl font-bold mb-6">{title}</h1>

      {Illustration && (
        <div className="mb-8">
          {Illustration}
        </div>
      )}

      <div className="prose prose-lg prose-invert text-text mb-8">
        <p>{essay}</p>
      </div>

      {downloadUrl && <DownloadLink url={downloadUrl} />}
      {audioUrl && <AudioOverview url={audioUrl} />}
    </article>
  );
}