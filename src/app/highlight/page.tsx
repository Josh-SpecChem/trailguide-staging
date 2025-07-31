"use client";
import React, { useState, useRef, useEffect } from "react";

// ---------- Modal (for highlight or chat) ----------
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

// ---------- Simple Popover for Footnotes ----------
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

// ---------- HighlightableText ----------
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

// ---------- Floating Chatbot Icon (now 20px higher) ----------
function FloatingChatbot({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      aria-label="Open Chatbot"
      onClick={onOpen}
      className="fixed bottom-24 right-6 z-50 bg-white shadow-2xl rounded-full w-20 h-20 flex items-center justify-center group transition-all outline-none border-4 border-neutral-200"
      style={{
        boxShadow: "0 8px 64px 0 rgba(0,0,0,0.20)",
        borderColor: "#dedede",
      }}
    >
      <img
        src="/images/flame.png"
        alt="Chatbot Flame Icon"
        className="w-16 h-16 object-contain drop-shadow-[0_6px_12px_rgba(30,30,30,0.35)]"
        width={64}
        height={64}
      />
      <span className="absolute bottom-[-28px] left-1/2 -translate-x-1/2 bg-neutral-900 text-black px-4 py-2 text-base rounded-full opacity-0 group-hover:opacity-100 pointer-events-none transition-all font-bold tracking-tight shadow-lg">
        Ask AI
      </span>
    </button>
  );
}

// ---------- Fake Chatbot Modal ----------
function ChatbotModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! I'm here to help shape your sermon. Ask a question, explore ideas, or paste a section for feedback." },
  ]);
  const [input, setInput] = useState("");
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, open]);

  function handleSend() {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { from: "user", text: input }]);
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        {
          from: "bot",
          text: `That's a thoughtful question! (Imagine a rich AI response here about "${input.slice(
            0,
            50
          )}")`,
        },
      ]);
    }, 700);
    setInput("");
  }

  return (
    <Modal open={open} onClose={onClose} className="max-w-2xl p-0">
      <div className="flex flex-col h-[400px] w-full">
        <div className="flex-shrink-0 px-6 py-4 border-b border-neutral-700 flex items-center gap-2">
          <span className="font-bold text-lg text-purple-300">Ask AI</span>
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
        </div>
        <form
          className="flex gap-2 p-4 border-t border-neutral-700 bg-neutral-950"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            className="flex-1 rounded-full px-4 py-2 bg-neutral-800 text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question, paste a paragraph, etc…"
            autoFocus
          />
          <button
            type="submit"
            className="bg-gradient-to-tr from-purple-600 to-indigo-500 rounded-full px-5 py-2 text-black font-semibold hover:from-purple-700 hover:to-indigo-600 transition"
          >
            Send
          </button>
        </form>
      </div>
    </Modal>
  );
}

// ========== Demo Page (SermonShaper) ==========
export default function SermonShaperDemoPage() {
  const [highlightModalOpen, setHighlightModalOpen] = useState(false);
  const [highlightText, setHighlightText] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  // Footnotes: example for demo (can be more theological in real use)
  const footnotes = [
    { number: 1, content: "The Greek word for 'reconciliation' here conveys a deep sense of restored relationship." },
    { number: 2, content: "See also Colossians 1:20 for a parallel vision of cosmic renewal." },
  ];

  function handleHighlight(text: string) {
    setHighlightText(text);
    setHighlightModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex items-start justify-center px-4 py-6 relative">
      <div className="max-w-prose w-full mt-2">
        <h1 className="text-3xl font-extrabold mb-2 tracking-tight">SermonShaper <span className="text-purple-400 font-semibold text-lg">AI-powered</span></h1>
        <div className="mb-12 text-base text-neutral-300 font-medium border-b border-white">
          Draft your sermon and shape your message—with the wisdom of tradition and the agility of AI.
        </div>
        <p className="mb-4">
          <HighlightableText footnotes={footnotes} onHighlight={handleHighlight}>
            This morning, we gather not as perfect people but as those in process—longing, questioning, being remade. 
            The story of the prodigal son invites us beyond simple moral categories into the radical hospitality of God, 
            whose embrace always surprises us. What if the true point of this parable is not the journey away, but the movement home—an awakening to belovedness that reshapes our imagination for each other and our world? 
            In a culture that rewards striving and scarcity, Jesus offers a feast of abundance for those ready to return[^1]. 
            We are invited to lay down the narratives of separation and receive a grace that mends not only hearts, but communities.
          </HighlightableText>
        </p>
        <p>
          <HighlightableText footnotes={footnotes} onHighlight={handleHighlight}>
            The table of God is wide enough for every hunger and every doubt. 
            This is not cheap inclusion but costly reconciliation, a way of being that refuses to let difference have the last word. 
            In Christ, all things are being made new, and the “other” becomes a brother or sister. 
            May we become a people who risk vulnerability, who make room for restoration, and who, in all things, trust that the story is still being written through us, even here, even now[^2].
          </HighlightableText>
        </p>

        {/* Modal with highlight actions */}
        <Modal open={highlightModalOpen} onClose={() => setHighlightModalOpen(false)}>
          <h2 className="font-semibold text-lg mb-2">Highlighted Text</h2>
          <div className="bg-neutral-200 dark:bg-neutral-800 rounded p-3 mb-4 text-neutral-800 dark:text-neutral-100 text-sm">
            {highlightText}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              className="px-4 py-2 rounded bg-purple-600 text-black font-medium hover:bg-purple-700"
              onClick={() => {
                navigator.clipboard.writeText(highlightText);
                setHighlightModalOpen(false);
              }}
            >
              Copy
            </button>
            <button
              className="px-4 py-2 rounded bg-blue-600 text-black font-medium hover:bg-blue-700"
              onClick={() => alert("Share feature coming soon!")}
            >
              Share
            </button>
            <button
              className="px-4 py-2 rounded bg-green-600 text-black font-medium hover:bg-green-700"
              onClick={() => {
                setHighlightModalOpen(false);
                setChatOpen(true);
              }}
            >
              Ask AI
            </button>
            <button
              className="px-4 py-2 rounded bg-gray-500 text-black font-medium hover:bg-gray-700"
              onClick={() => setHighlightModalOpen(false)}
            >
              Close
            </button>
          </div>
        </Modal>
      </div>
      {/* Floating Chatbot */}
      <FloatingChatbot onOpen={() => setChatOpen(true)} />
      {/* Full Chat Modal */}
      <ChatbotModal open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}