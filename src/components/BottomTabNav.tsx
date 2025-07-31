import { useState } from "react";

// 12 agents representing sermon-building practices/roles
const AGENTS = [
  { key: "text", label: "Text", icon: "📖", color: "bg-blue-600", description: "Select or analyze the main Scripture text." },
  { key: "context", label: "Context", icon: "🌍", color: "bg-green-700", description: "Explore historical/cultural context." },
  { key: "theme", label: "Theme", icon: "💡", color: "bg-yellow-400", description: "Discern main themes or big ideas." },
  { key: "character", label: "Character", icon: "🧑‍🤝‍🧑", color: "bg-fuchsia-600", description: "Study biblical characters or voices." },
  { key: "application", label: "Apply", icon: "🛠️", color: "bg-orange-500", description: "Work on practical application." },
  { key: "prayer", label: "Prayer", icon: "🙏", color: "bg-cyan-700", description: "Invite prayer and meditation." },
  { key: "language", label: "Language", icon: "🔤", color: "bg-emerald-700", description: "Dig into words, languages, nuance." },
  { key: "justice", label: "Justice", icon: "⚖️", color: "bg-pink-600", description: "Highlight justice/social concerns." },
  { key: "community", label: "Community", icon: "🤝", color: "bg-indigo-600", description: "Engage with community insights." },
  { key: "media", label: "Media", icon: "🎬", color: "bg-rose-600", description: "Use story, media, arts in preaching." },
  { key: "reflection", label: "Reflect", icon: "📝", color: "bg-yellow-500", description: "Reflect and synthesize insights." },
  { key: "flame", label: "Inspire", icon: "🔥", color: "bg-red-500", description: "Holy Spirit inspiration—ignite!" },
];

type AgentBarProps = {
  selectedAgent: string;
  setSelectedAgent: (agentKey: string) => void;
};

export default function AgentBar({ selectedAgent, setSelectedAgent }: AgentBarProps) {
  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-white/80 border-t border-neutral-800 shadow-2xl">
      <div className="flex flex-row gap-2 overflow-x-auto px-2 py-2 sm:justify-center scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
        {AGENTS.map((agent) => (
          <div key={agent.key} className="flex flex-col items-center mx-1">
            <button
              onClick={() => setSelectedAgent(agent.key)}
              className={`flex items-center justify-center rounded-full transition-all group focus:outline-none focus:ring-2 focus:ring-purple-400
                ${selectedAgent === agent.key ? "ring-2 ring-purple-400 " + agent.color : "bg-neutral-800 hover:bg-neutral-700"}
              `}
              aria-label={agent.label}
              style={{ width: 48, height: 48, minWidth: 48, minHeight: 48 }}
              tabIndex={0}
            >
              <span
                className={`text-2xl ${selectedAgent === agent.key ? "text-black" : "text-neutral-300 group-hover:text-black"}`}
              >
                {agent.icon}
              </span>
            </button>
            <span
              className="text-[11px] text-neutral-300 mt-1 truncate w-14 text-center select-none"
              title={agent.label}
            >
              {agent.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}