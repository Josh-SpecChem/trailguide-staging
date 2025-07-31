import React from "react";
import { LucideIcon } from "lucide-react";

interface SidebarSectionProps {
    label: string;
    icon: LucideIcon;
    isOpen: boolean;
    onToggle: () => void;
    links: { href: string; label: string; isActive?: boolean }[];
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ label, icon: Icon, isOpen, onToggle, links }) => (
    <div>
        <button
            onClick={onToggle}
            className={`flex items-center w-full px-3 py-2 text-left rounded-md transition hover:bg-gray-100 ${isOpen ? "bg-gray-100 text-forest font-semibold" : "text-gray-700"
                }`}
        >
            <Icon className="w-5 h-5 mr-3 flex-shrink-0 text-emerald" />
            {label}
            <span className={`ml-auto transform transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
        </button>
        {isOpen && (
            <div className="ml-6 mt-2 space-y-1">
                {links.map((link, i) => (
                    <a
                        key={i}
                        href={link.href}
                        data-scrollspy-id={link.href.replace('#', '')}
                        className={`block text-sm px-2 py-1 rounded-md transition ${link.isActive
                                ? "text-emerald-700 bg-emerald-50 font-medium"
                                : "text-gray-600 hover:text-emerald-600"
                            }`}
                    >
                        {link.label}
                    </a>
                ))}
            </div>
        )}
    </div>
);

export default SidebarSection;