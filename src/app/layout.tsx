import "./globals.css";

export const metadata = {
  title: "Alan Hirsch",
  description: "Alan Hirsch is a writer, speaker, and missional catalyst helping reawaken the church’s original DNA.",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/192.png",
  },
  themeColor: "#111112", // Or whatever your bg is
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="min-h-screen bg-background text-foreground font-sans">
        <main className="pb-20">{children}</main>
      </body>
    </html>
  );
}