// components/ModelIllustration.tsx
export default function ModelIllustration({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="w-full mb-6 bg-whiteOlive border border-border rounded-lg overflow-hidden">
      <img src={src} alt={alt} className="w-full h-auto" />
    </div>
  );
}