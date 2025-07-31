"use client";
import React, { useState, useRef, useEffect } from "react";
import { WriterTopNavBar } from "@/components/writer/WriterTopNavBar";

// ---------------- AGENT DEFINITIONS ------------------
const AGENT_ICONS = {
  flame:      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><circle cx="32" cy="32" r="30" fill="orange"/><path d="M32 54 Q24 38 32 22 Q40 38 32 54Z" fill="gold" stroke="red" stroke-width="2"/></svg>',
  text:       'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect x="6" y="14" width="52" height="36" rx="8" fill="white" stroke="black" stroke-width="2"/><text x="18" y="42" font-size="18" font-family="Arial" fill="black">T</text></svg>',
  context:    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect x="12" y="12" width="40" height="40" rx="10" fill="teal"/><circle cx="32" cy="32" r="14" fill="white"/></svg>',
  themes:     'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><circle cx="32" cy="32" r="24" fill="mediumpurple"/><circle cx="22" cy="32" r="6" fill="white"/><circle cx="42" cy="32" r="6" fill="white"/></svg>',
  characters: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><ellipse cx="32" cy="28" rx="14" ry="10" fill="peachpuff"/><ellipse cx="32" cy="46" rx="18" ry="8" fill="#999"/><circle cx="25" cy="28" r="2" fill="black"/><circle cx="39" cy="28" r="2" fill="black"/></svg>',
  app:        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect x="16" y="16" width="32" height="32" rx="8" fill="deepskyblue"/><rect x="22" y="24" width="20" height="4" fill="white"/><rect x="22" y="36" width="20" height="4" fill="white"/></svg>',
  community:  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><circle cx="20" cy="36" r="10" fill="skyblue"/><circle cx="44" cy="36" r="10" fill="pink"/><circle cx="32" cy="28" r="10" fill="lightgreen"/></svg>',
  justice:    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect x="20" y="38" width="24" height="10" fill="#f4c542"/><rect x="28" y="24" width="8" height="16" fill="#f4c542"/><rect x="20" y="20" width="24" height="4" fill="#555"/></svg>',
  prayer:     'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><ellipse cx="32" cy="40" rx="16" ry="8" fill="lavender"/><ellipse cx="32" cy="28" rx="6" ry="14" fill="white" stroke="purple" stroke-width="2"/></svg>',
  media:      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="14" fill="midnightblue"/><polygon points="22,18 50,32 22,46" fill="white"/></svg>',
  creative:   'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><ellipse cx="32" cy="32" rx="18" ry="14" fill="hotpink"/><path d="M32 20 Q38 26 32 44 Q26 26 32 20Z" fill="white"/></svg>',
  language:   'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect x="8" y="16" width="48" height="32" rx="10" fill="#f3e6b0"/><text x="19" y="38" font-size="16" font-family="Arial" fill="#555">&#x03A9;</text></svg>',
};

// ---------------- AGENT DEFINITIONS ------------------
const AGENTS = [
  { id: "inspiration", label: "Inspiration", icon: "/images/inspiration.png" },
  { id: "textual",     label: "Textual",     icon: "/images/textual.png" },
  { id: "context",     label: "Context",     icon: "/images/context.png" },
  { id: "themes",      label: "Themes",      icon: "/images/themes.png" },
  { id: "characters",  label: "Characters",  icon: "/images/characters.png" },
  { id: "application", label: "Application", icon: "/images/application.png" },
  { id: "community",   label: "Community",   icon: "/images/community.png" },
  { id: "justice",     label: "Justice",     icon: "/images/justice.png" },
  { id: "prayer",      label: "Prayer",      icon: "/images/prayer.png" },
  { id: "media",       label: "Media",       icon: "/images/media.png" },
  { id: "creative",    label: "Creative",    icon: "/images/creative.png" },
  { id: "language",    label: "Language",    icon: "/images/language.png" },
];

const AGENT_WELCOME: Record<string, string> = {
  inspiration: `Welcome! I’m your Inspiration agent. Let’s begin by grounding ourselves—where are you coming from today? If you’d like, start with a simple prayer or reflection. We’ll shape your message together, moving at your pace. When you’re ready, I can invite other agents to join us as needed.`,
  textual: `You’re with the Textual agent—your companion for digging deep into the words. Want to explore Greek or Hebrew nuances, etymology, or the structure of the text? I’ll help you uncover what’s really there, always in the service of faithful, life-giving proclamation.`,
  context: `This is the Context agent. Let’s step into the world behind the text—history, culture, authorship, and context. Want to understand the setting, the world, and the people this text first spoke to? I’m here for that journey.`,
  themes: `Welcome to the Themes agent. Let’s listen for the big story—what threads and motifs is God weaving in this text? How does this connect with the drama of Scripture, and what is God up to, then and now?`,
  characters: `You’ve summoned the Characters agent. Who are the voices and personalities in this text? Let’s enter their world and, if you wish, dialogue with them—never for show, always for deeper insight and empathy.`,
  application: `This is the Application agent, ready to help you bridge the gap between Scripture and today. Let’s explore how this text speaks to your context, your people, and the world as it is.`,
  community: `You’re now with the Community agent. We’ll reflect on your congregation, your context, and how this message takes shape among real people. Need help reading the room, naming your context, or weaving in congregational insight? Let’s do it together.`,
  justice: `Welcome to the Justice agent. Here, we ask: What does this mean for those at the margins? How do we honor the call of Christ to the least of these? Let’s imagine practical, redemptive outcomes for your community and beyond.`,
  prayer: `This is the Prayer agent. Let’s pause. I’m here to help you enter prayer—personal, contemplative, or communal. Want a prompt for guided prayer, a centering exercise, or space to be still? Ask, and let’s listen together.`,
  media: `You’re with the Media agent. Want to spark imagination through film, music, or visual art? I can help you find meaningful clips, quotes, or even suggest ways to illustrate your message creatively.`,
  creative: `Welcome to the Creative agent—your space for the unexpected. Need a new angle, a metaphor, or help breaking through writer’s block? Let’s experiment, play, and make room for fresh inspiration.`,
  language: `This is the Language agent. Need help with translation, inclusive language, or making your message accessible? I’m here to support clarity and resonance, for every listener.`,
};


// ---------- Modal (for highlight or chat) ----------
// (Removed duplicate Modal implementation)

// ---------- Popover & Footnote (unchanged) ----------
function Popover({ content, children }: { content: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <span className="relative inline-block">
      <span
        onClick={() => setOpen((v) => !v)}
        onMouseLeave={() => setOpen(false)}
        className="cursor-pointer"
      >
        {children}
      </span>
      {open && (
        <span
          className="absolute left-1/2 z-50 -translate-x-1/2 mt-2 min-w-[180px] max-w-xs rounded bg-neutral-800 text-neutral-100 p-3 text-xs shadow-xl border border-neutral-700"
          style={{ whiteSpace: "normal" }}
        >
          {content}
        </span>
      )}
    </span>
  );
}
function InlineFootnoteReference({ number, content }: { number: number | string; content: string }) {
  return (
    <Popover content={content}>
      <sup className="mx-0.5 cursor-pointer text-purple-400 align-super hover:underline">
        [{number}]
      </sup>
    </Popover>
  );
}

// ---------- HighlightableText (unchanged) ----------
function getStringFromChildren(children: React.ReactNode): string {
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(getStringFromChildren).join("");
  if (children && typeof children === "object" && "props" in children) {
    // @ts-ignore
    return getStringFromChildren(children.props.children);
  }
  return "";
}
function renderTextWithFootnotes(
  text: string,
  footnotes: { number: number; content: string }[] = []
) {
  let output: React.ReactNode[] = [];
  let lastIndex = 0;
  const regex = /\[\^(\d+)\]/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text))) {
    const n = Number(match[1]);
    const note = footnotes.find((f) => f.number === n);
    output.push(text.slice(lastIndex, match.index));
    if (note) {
      output.push(<InlineFootnoteReference key={n} number={n} content={note.content} />);
    } else {
      output.push(match[0]);
    }
    lastIndex = regex.lastIndex;
  }
  output.push(text.slice(lastIndex));
  return output;
}
function HighlightableText({
  children,
  footnotes = [],
  onHighlight,
}: {
  children: React.ReactNode;
  footnotes?: { number: number; content: string }[];
  onHighlight: (text: string) => void;
}) {
  const contentString = getStringFromChildren(children);

  const handleMouseUp = () => {
    const sel = window.getSelection();
    const selectedText = sel?.toString() ?? "";
    if (selectedText.length > 0) {
      onHighlight(selectedText);
      setTimeout(() => window.getSelection()?.removeAllRanges(), 200);
    }
  };

  return (
    <span
      className="relative group"
      onMouseUp={handleMouseUp}
      style={{ userSelect: "text", cursor: "text" }}
    >
      {renderTextWithFootnotes(contentString, footnotes)}
    </span>
  );
}

// ---------- Floating Chatbot Icon (updates with agent) ----------
// (Removed duplicate FloatingChatbot implementation)

// ---------- Fake Chatbot Modal (updates with agent) ----------
// ---------- Modal (for chat) ----------
function Modal({
  open,
  onClose,
  children,
  className = "",
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
      <div className={`bg-neutral-900 rounded-xl shadow-xl p-6 max-w-lg w-full relative ${className}`}>
        <button
          className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-200 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

// ---------- Floating Chatbot Icon ----------
function FloatingChatbot({
  onOpen,
  agent,
}: {
  onOpen: () => void;
  agent: typeof AGENTS[number];
}) {
  return (
    <button
      aria-label={`Open ${agent.label} Chatbot`}
      onClick={onOpen}
      className="fixed bottom-24 right-6 z-50 bg-white shadow-2xl rounded-full w-20 h-20 flex items-center justify-center group transition-all outline-none border-4 border-neutral-200"
      style={{
        boxShadow: "0 8px 64px 0 rgba(0,0,0,0.20)",
        borderColor: "#dedede",
      }}
    >
      <img
        src={agent.icon}
        alt={agent.label}
        className="w-16 h-16 object-contain drop-shadow-[0_6px_12px_rgba(30,30,30,0.35)]"
        width={64}
        height={64}
      />
      <span className="absolute bottom-[-28px] left-1/2 -translate-x-1/2 bg-neutral-900 text-black px-4 py-2 text-base rounded-full opacity-0 group-hover:opacity-100 pointer-events-none transition-all font-bold tracking-tight shadow-lg">
        {agent.label}
      </span>
    </button>
  );
}

// ---------- Fake Chatbot Modal (updates with agent) ----------
function ChatbotModal({
  open,
  onClose,
  agent,
}: {
  open: boolean;
  onClose: () => void;
  agent: typeof AGENTS[number];
}) {
  const [messages, setMessages] = useState([
    { from: "bot", text: AGENT_WELCOME[agent.id] || "How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, open]);

  // Reset to the agent's welcome message when opening or agent changes
  useEffect(() => {
    if (open) {
      setMessages([
        { from: "bot", text: AGENT_WELCOME[agent.id] || "How can I help you today?" }
      ]);
    }
  }, [agent, open]);

  async function handleSend() {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input;
    setInput("");
    setMessages((msgs) => [...msgs, { from: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      console.log('🚀 Sending message to agent:', agent.id);
      console.log('📨 Message:', userMessage);
      
      // Try streaming first, fall back to regular if needed
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          agentId: agent.id,
        }),
      });

      console.log('📡 Response status:', response.status);
      console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response not OK:', response.status, errorText);
        throw new Error(`Failed to get response: ${response.status} ${errorText}`);
      }

      // Check if response is streaming
      if (response.headers.get('content-type')?.includes('text/event-stream')) {
        console.log('🌊 Detected streaming response');
        // Handle streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let currentMessage = '';

        // Add initial empty message that we'll update
        const messageIndex = messages.length + 1; // +1 because we already added user message
        console.log('💬 Adding empty message at index:', messageIndex);
        setMessages((msgs) => [
          ...msgs,
          { from: "bot", text: "" }
        ]);

        if (reader) {
          console.log('🔄 Starting to read streaming response...');
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              console.log('✅ Stream reading completed');
              break;
            }

            const chunk = decoder.decode(value);
            console.log('📦 Received chunk:', chunk);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataString = line.slice(6);
                console.log('📝 Processing data line:', dataString);
                try {
                  const data = JSON.parse(dataString);
                  console.log('🎯 Parsed event:', data);
                  
                  if (data.type === 'text_delta') {
                    currentMessage += data.content;
                    console.log('✏️ Adding text delta:', data.content);
                    setMessages((msgs) => {
                      const newMsgs = [...msgs];
                      newMsgs[messageIndex] = { from: "bot", text: currentMessage };
                      return newMsgs;
                    });
                  } else if (data.type === 'text_complete') {
                    // Handle complete text chunks from Responses API
                    currentMessage += data.content;
                    console.log('📝 Adding complete text:', data.content);
                    setMessages((msgs) => {
                      const newMsgs = [...msgs];
                      newMsgs[messageIndex] = { from: "bot", text: currentMessage };
                      return newMsgs;
                    });
                  } else if (data.type === 'done') {
                    console.log('🏁 Received done event');
                    break;
                  } else {
                    console.log('❓ Unknown event type:', data.type, data);
                  }
                } catch (e) {
                  console.warn('⚠️ Failed to parse JSON:', dataString, e);
                }
              } else if (line.trim()) {
                console.log('📄 Non-data line:', line);
              }
            }
          }
        }
      } else {
        // Handle regular JSON response as fallback
        console.log('📄 Detected regular JSON response');
        const data = await response.json();
        console.log('📊 Response data:', data);
        setMessages((msgs) => [
          ...msgs,
          {
            from: "bot",
            text: data.response || "Sorry, I couldn't generate a response.",
          },
        ]);
      }
    } catch (error) {
      console.error('💥 Chat error:', error);
      console.error('🔍 Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      
      // Fall back to regular API
      try {
        console.log('🔄 Attempting fallback to regular API...');
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage,
            agentId: agent.id,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Fallback API successful:', data);
          setMessages((msgs) => [
            ...msgs,
            {
              from: "bot",
              text: data.response || "Sorry, I couldn't generate a response.",
            },
          ]);
        } else {
          const errorText = await response.text();
          console.error('❌ Fallback API failed:', response.status, errorText);
          throw new Error('Both APIs failed');
        }
      } catch (fallbackError) {
        console.error('💀 Fallback error:', fallbackError);
        setMessages((msgs) => [
          ...msgs,
          {
            from: "bot",
            text: "Sorry, I'm having trouble connecting right now. Please try again.",
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} className="max-w-2xl p-0">
      <div className="flex flex-col h-[400px] w-full">
        <div className="flex-shrink-0 px-6 py-4 border-b border-neutral-700 flex items-center gap-3">
          <img
            src={agent.icon}
            alt={agent.label}
            className="w-8 h-8 object-contain"
          />
          <span className="font-bold text-lg text-purple-300">{agent.label}</span>
          <span className="ml-2 text-xs text-neutral-400">SermonShaper</span>
        </div>
        <div
          ref={chatWindowRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-900"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-2xl px-4 py-2 max-w-[75%] ${
                  msg.from === "bot"
                    ? "bg-purple-900/70 text-black"
                    : "bg-white text-neutral-900"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-purple-900/70 text-black rounded-2xl px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <form
          className="flex gap-2 p-4 border-t border-neutral-700 bg-neutral-950"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            className="flex-1 rounded-full px-4 py-2 bg-neutral-800 text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:opacity-50"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask your ${agent.label} agent...`}
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-tr from-purple-600 to-indigo-500 rounded-full px-5 py-2 text-black font-semibold hover:from-purple-700 hover:to-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </Modal>
  );
}

// ========== Demo Page (SermonShaper) ==========
export default function SermonShaperDemoPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0]);
  const [sermonDraft, setSermonDraft] = useState(
    `This morning, we gather not as perfect people but as those in process—longing, questioning, being remade.
The story of the prodigal son invites us beyond simple moral categories into the radical hospitality of God, whose embrace always surprises us. What if the true point of this parable is not the journey away, but the movement home—an awakening to belovedness that reshapes our imagination for each other and our world? In a culture that rewards striving and scarcity, Jesus offers a feast of abundance for those ready to return. We are invited to lay down the narratives of separation and receive a grace that mends not only hearts, but communities.

The table of God is wide enough for every hunger and every doubt. This is not cheap inclusion but costly reconciliation, a way of being that refuses to let difference have the last word. In Christ, all things are being made new, and the “other” becomes a brother or sister. May we become a people who risk vulnerability, who make room for restoration, and who, in all things, trust that the story is still being written through us, even here, even now.
`
  );

  return (
    <>
      <WriterTopNavBar
        scripture="Sermon Text: Luke 15:11-32 (The Prodigal Son)"
        onClickScripture={() => alert("Pick scripture modal coming soon!")}
      />
    <div className="min-h-screen bg-gradient-to-br from-[#161622] via-[#211d29] to-[#0d1117] text-neutral-100 flex items-start justify-center px-2 py-2 relative">
      <div className="w-full max-w-4xl">
        <div className="rounded-2xl shadow-xl bg-[#181825]/80 border border-neutral-800 p-2">
          {/* --- Actual Writing Area --- */}
          <textarea
  value={sermonDraft}
  onChange={(e) => setSermonDraft(e.target.value)}
  rows={14}
  className="mt-12 w-full font-mono text-xl leading-relaxed bg-[#16161d] border border-neutral-800 rounded-xl p-5 text-neutral-100 placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-purple-600 transition-all shadow-md resize"
  style={{
    caretColor: '#fff',
    letterSpacing: '0.05em',
    // 👇 ADD THIS LINE
    resize: 'both',
  }}
  placeholder="Start writing your sermon here…"
  spellCheck
  autoFocus
/>
        </div>
      </div>
      {/* --- Floating Chatbot --- */}
      <FloatingChatbot onOpen={() => setChatOpen(true)} agent={selectedAgent} />
      {/* --- Full Chat Modal --- */}
      <ChatbotModal open={chatOpen} onClose={() => setChatOpen(false)} agent={selectedAgent} />
      {/* --- Bottom Agent Selector Bar --- */}
      <div className="fixed left-0 right-0 bottom-0 z-40 bg-neutral-900 border-t border-neutral-800 px-2 py-1 flex flex-row justify-center items-center gap-1 overflow-x-auto shadow-2xl">
        {AGENTS.map((agent) => (
          <button
            key={agent.id}
            onClick={() => setSelectedAgent(agent)}
            className={`
              flex flex-col items-center justify-center px-2 py-2 rounded-lg transition-all
              ${selectedAgent.id === agent.id
                ? "bg-purple-800/70 scale-105 shadow-md"
                : "hover:bg-neutral-800/80"
              }
            `}
            style={{ minWidth: 60, minHeight: 56 }}
            aria-label={agent.label}
          >
            <img
              src={agent.icon}
              alt={agent.label}
              className="w-8 h-8 object-contain mb-1"
              style={{
                filter: selectedAgent.id === agent.id ? "drop-shadow(0 2px 6px #a78bfa80)" : "none",
              }}
            />
            <span className="text-xs text-neutral-200 font-medium">{agent.label}</span>
          </button>
        ))}
      </div>
    </div>
    </>
  );
}