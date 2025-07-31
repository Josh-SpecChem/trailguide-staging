"use client";

export default function Footer() {
  return (
    <footer className="bg-smokyBlack text-text py-12 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <h4 className="text-lg font-bold mb-2 text-tekhelet">Alan Hirsch</h4>
          <p className="text-sm text-text-muted">Reactivating the church as a movement.</p>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-2 text-tekhelet">Explore</h4>
          <ul className="space-y-1">
            <li><a href="/frameworks" className="hover:underline text-text-muted">Frameworks</a></li>
            <li><a href="/writing" className="hover:underline text-text-muted">Writing</a></li>
            <li><a href="/archive" className="hover:underline text-text-muted">Archive</a></li>
            <li><a href="/alanbot" className="hover:underline text-text-muted">AlanBot</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-2 text-tekhelet">Connect</h4>
          <p className="text-sm text-text-muted">
            Built by friends of the movement.<br />
            © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}