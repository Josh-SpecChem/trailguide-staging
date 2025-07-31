"use client";

export default function IntroBlock({ introText, videoUrl }: { introText: string; videoUrl: string }) {
  return (
    <div className="text-center space-y-6 dark:bg-gray-900 dark:text-black">
      <p className="text-xl md:text-2xl font-light text-text">{introText}</p>
      <div className="aspect-video max-w-3xl mx-auto">
        <iframe
          className="w-full h-full rounded-lg shadow-lg"
          src={videoUrl}
          title="Intro Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}