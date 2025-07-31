// /components/CoursePromo.tsx
export function CoursePromo({ course }: { course: any }) {
  return (
    <div className="bg-smokyBlack rounded-xl p-6 space-y-4 text-text border border-border">
      <h2 className="text-2xl font-bold">{course.title}</h2>
      <div className="aspect-video w-full overflow-hidden rounded-xl">
        <iframe
          src={course.videoUrl}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <p className="text-text-muted text-sm">{course.description}</p>
      <a
        href={course.syllabusLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-tekhelet text-sm underline"
      >
        View Syllabus
      </a>
    </div>
  );
}