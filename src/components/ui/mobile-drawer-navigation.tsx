"use client";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Menu, BookOpen, Settings, Home } from "lucide-react";
import { useState } from "react";

export function MobileDrawerNavigation({
  toc,
  shortcuts,
  settingsContent,
}: {
  toc: { label: string; href: string }[];
  shortcuts?: { label: string; icon: React.ReactNode; href: string }[];
  settingsContent?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="icon" variant="ghost" className="md:hidden fixed top-2 left-2 z-50">
          <Menu className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-screen w-72 bg-white dark:bg-neutral-900 flex flex-col p-4 gap-4">
        <TOCListMobile toc={toc} />
        <NavShortcutListMobile shortcuts={shortcuts} />
        <SettingsPanelMobile content={settingsContent} />
      </DrawerContent>
    </Drawer>
  );
}

export function TOCListMobile({ toc }: { toc: { label: string; href: string }[] }) {
  return (
    <nav>
      <div className="font-bold text-sm mb-2 flex items-center gap-1">
        <BookOpen className="h-4 w-4" /> Chapters
      </div>
      <ul className="flex flex-col gap-2">
        {toc.map((item) => (
          <li key={item.href}>
            <a href={item.href} className="block px-2 py-1 rounded hover:bg-muted transition">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function NavShortcutListMobile({ shortcuts }: { shortcuts?: { label: string; icon: React.ReactNode; href: string }[] }) {
  if (!shortcuts?.length) return null;
  return (
    <nav className="mt-6">
      <div className="font-bold text-sm mb-2 flex items-center gap-1">
        <Home className="h-4 w-4" /> Shortcuts
      </div>
      <ul className="flex gap-4">
        {shortcuts.map((item) => (
          <li key={item.href}>
            <a href={item.href} className="flex flex-col items-center text-xs text-muted-foreground hover:text-primary">
              {item.icon}
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SettingsPanelMobile({ content }: { content?: React.ReactNode }) {
  return (
    <div className="mt-auto border-t pt-4">
      <div className="font-bold text-sm mb-2 flex items-center gap-1">
        <Settings className="h-4 w-4" /> Settings
      </div>
      {content ?? <div className="text-xs text-muted-foreground">Settings go here.</div>}
    </div>
  );
}