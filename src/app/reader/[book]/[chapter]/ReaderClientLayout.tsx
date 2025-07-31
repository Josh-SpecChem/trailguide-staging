"use client";

import { useState, useRef, useEffect } from "react";
import { LoginModal } from "@/components/ui/login-modal";
import { ReflectionPromptBlock } from "@/components/ui/reflection-prompt-block";
import { EndOfChapterActions } from "@/components/ui/end-of-chapter-actions";
import { CommentThread } from "@/components/ui/comment-thread";
import { CalloutBlock } from "@/components/ui/callout-block";
import { VideoEmbed } from "@/components/ui/video-embed";
import { InlineFootnoteReference } from "@/components/readwise/inline-footnote-reference";
import { HighlightableText } from "@/components/readwise/HighlightableText";
import { HighlightModal } from "@/components/readwise/HighlightModal";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// ---- TypeScript Types for clarity ----
interface ReaderClientLayoutProps {
  MDXContent: React.ComponentType<any>;
  bookTitle: string;
  chapterMeta: { title: string };
  chapters?: Array<{ slug: string; title: string }>;
  book?: string;
}

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
  inspiration: `Welcome! I'm your Inspiration agent for Alan Hirsch's work. Let's explore how his ideas about missional church and movement dynamics might inspire transformation in your context. Where are you coming from today?`,
  textual: `You're with the Textual agent—your companion for diving deep into Alan Hirsch's writings. Want to explore specific concepts, terminology, or textual analysis of his frameworks? I'll help you uncover what's really there.`,
  context: `This is the Context agent. Let's explore the historical and cultural background behind Alan Hirsch's ideas—the movements, thinkers, and contexts that shaped his missional theology and Forge mission.`,
  themes: `Welcome to the Themes agent. Let's trace the big themes in Alan Hirsch's work—from Apostolic Genius to 5Q leadership, from movement dynamics to missional DNA. How do these themes connect and build on each other?`,
  characters: `You've summoned the Characters agent. Let's explore the people and personalities that shaped Alan's thinking, or dive into case studies and examples from his work. Who are the voices and movements he draws from?`,
  application: `This is the Application agent, ready to help you bridge Alan Hirsch's concepts with your real-world context. How might 5Q leadership or Apostolic Genius apply to your church, organization, or community?`,
  community: `You're now with the Community agent. We'll reflect on how Alan's ideas about community, church, and movement building speak to your specific context and relationships. What would missional community look like for you?`,
  justice: `Welcome to the Justice agent. Here we explore how Alan Hirsch's missional theology connects with justice, transformation, and God's heart for the world. How do his frameworks serve the kingdom mission?`,
  prayer: `This is the Prayer agent. Let's pause and center ourselves. How might Alan's emphasis on spiritual formation and discipleship shape our prayer and contemplative practice? Let's listen together.`,
  media: `You're with the Media agent. Want to explore videos, interviews, or other media featuring Alan Hirsch? I can help you find relevant content that brings his ideas to life through multimedia.`,
  creative: `Welcome to the Creative agent—your space for innovation with Alan's frameworks. Need fresh angles on 5Q, new ways to visualize Apostolic Genius, or creative applications of his movement principles?`,
  language: `This is the Language agent. Let's work with Alan's specific terminology, translation of concepts for different contexts, and making his frameworks accessible and clear for your audience.`,
};

// ---- Utility: Recursively flatten any children to a plain string ----
function flattenToString(children: React.ReactNode): string {
  // Handles strings, numbers, arrays, and React elements
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(flattenToString).join("");
  }
  if (
    typeof children === "object" &&
    children !== null &&
    "props" in children &&
    (children as any).props &&
    "children" in (children as any).props
  ) {
    return flattenToString((children as any).props.children);
  }
  // If none of the above, return empty string (could be boolean/null/undefined)
  return "";
}

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
      <div className={`bg-[#232326] border border-[#3f3f46] rounded-2xl shadow-lg p-0 max-w-2xl w-full mx-4 relative ${className}`}>
        <button
          className="absolute top-4 right-4 text-[#a1a1aa] hover:text-black text-xl z-10 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#18181b] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6]"
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
      className="fixed bottom-24 right-6 z-50 bg-[#8b5cf6] hover:bg-[#7c3aed] shadow-lg rounded-2xl w-16 h-16 flex items-center justify-center group transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111112] border border-[#232326]"
    >
      <img
        src={agent.icon}
        alt={agent.label}
        className="w-8 h-8 object-contain"
        width={32}
        height={32}
      />
      <span className="absolute bottom-[-32px] left-1/2 -translate-x-1/2 bg-[#232326] border border-[#3f3f46] text-black px-3 py-1 text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all font-['Inter'] font-medium whitespace-nowrap">
        {agent.label}
      </span>
    </button>
  );
}

// ---------- Chatbot Modal ----------
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
    { from: "bot", text: AGENT_WELCOME[agent.id] || "How can I help you explore Alan Hirsch's ideas?" },
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
        { from: "bot", text: AGENT_WELCOME[agent.id] || "How can I help you explore Alan Hirsch's ideas?" }
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
    <Modal open={open} onClose={onClose} className="max-w-2xl p-0 bg-[#232326] border border-[#3f3f46]">
      <div className="flex flex-col h-[500px] w-full">
        <div className="flex-shrink-0 px-6 py-4 border-b border-[#3f3f46] flex items-center gap-3 bg-[#232326]">
          <img
            src={agent.icon}
            alt={agent.label}
            className="w-8 h-8 object-contain"
          />
          <span className="font-bold text-lg text-black font-['Inter']">{agent.label}</span>
          <span className="ml-2 text-sm text-[#a1a1aa] font-['Inter']">Alan Hirsch Reader</span>
        </div>
        <div
          ref={chatWindowRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 bg-white"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-xl px-4 py-3 max-w-[75%] font-['Georgia'] ${
                  msg.from === "bot"
                    ? "bg-[#232326] text-black border border-[#3f3f46]"
                    : "bg-[#8b5cf6] text-black"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#232326] border border-[#3f3f46] text-black rounded-xl px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[#8b5cf6] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#8b5cf6] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-[#8b5cf6] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <form
          className="flex gap-3 p-6 border-t border-[#3f3f46] bg-[#232326]"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            className="flex-1 rounded-lg px-4 py-3 bg-white border border-[#3f3f46] text-black placeholder:text-[#71717a] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] disabled:opacity-50 font-['Inter']"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask your ${agent.label} agent...`}
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-[#8b5cf6] hover:bg-[#7c3aed] rounded-lg px-6 py-3 text-black font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#232326] font-['Inter']"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </Modal>
  );
}

// ---------- Chapter Sidebar ----------
function ChapterSidebar({ 
  chapters = [], 
  book = "", 
  bookTitle = "", 
  currentChapter = "" 
}: { 
  chapters?: Array<{ slug: string; title: string }>;
  book?: string;
  bookTitle?: string;
  currentChapter?: string;
}) {
  return (
    <Sidebar className="bg-white border-r border-[#232326]">
      <SidebarHeader className="p-6 bg-white border-b border-[#232326]">
        <h2 className="text-lg font-bold text-black font-['Inter']">{bookTitle}</h2>
        <p className="text-sm text-[#a1a1aa] font-['Inter']">by Alan Hirsch</p>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#a1a1aa] font-medium font-['Inter'] text-sm">Chapters</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chapters.map((chapter, index) => (
                <SidebarMenuItem key={chapter.slug}>
                  <SidebarMenuButton 
                    asChild
                    isActive={chapter.slug === currentChapter}
                    className={`${chapter.slug === currentChapter 
                      ? "bg-[#8b5cf6] text-black font-medium" 
                      : "text-[#a1a1aa] hover:text-black hover:bg-[#232326]"
                    } transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111112]`}
                  >
                    <a 
                      href={`/reader/${book}/${chapter.slug}`}
                      className="flex items-center gap-3 px-3 py-2 rounded-md w-full text-left font-['Inter']"
                    >
                      <span className="text-[#71717a] text-sm font-mono min-w-[2rem] font-normal">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[0.95rem] leading-tight">{chapter.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail className="bg-[#232326]" />
    </Sidebar>
  );
}

export default function ReaderClientLayout({
  MDXContent,
  bookTitle,
  chapterMeta,
  chapters = [],
  book = "",
}: ReaderClientLayoutProps) {
  console.log('[ReaderClientLayout] Rendered!');
  // ---- Global Modal States ----
  const [highlightModalOpen, setHighlightModalOpen] = useState(false);
  const [highlightText, setHighlightText] = useState("");
  const [footnoteModalOpen, setFootnoteModalOpen] = useState(false);
  const [footnote, setFootnote] = useState<{ number: number; content: string }>({ number: 1, content: "" });
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const [reflection, setReflection] = useState("");

  // ---- AI Assistant States ----
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0]);

  const mdxComponents = {
    p: (props: { children: React.ReactNode }) => {
      const text = flattenToString(props.children);
      return (
        <HighlightableText
          onHighlight={(highlighted: string) => {
            setHighlightText(highlighted);
            setHighlightModalOpen(true);
          }}
        >
          {text}
        </HighlightableText>
      );
    },
    CalloutBlock: (props: any) => <CalloutBlock {...props} />,
    VideoEmbed: (props: any) => <VideoEmbed {...props} />,
    ReflectionPromptBlock: (props: any) => <ReflectionPromptBlock {...props} />,
    InlineFootnoteReference: (props: any) =>  <InlineFootnoteReference {...props} />,
  };

  return (
    <SidebarProvider>
      <ChapterSidebar 
        chapters={chapters}
        book={book}
        bookTitle={bookTitle}
        currentChapter={chapterMeta.title}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-[#232326] px-6 bg-white">
          <SidebarTrigger className="-ml-1 text-black hover:text-[#8b5cf6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6]" />
          <Separator
            orientation="vertical"
            className="mr-2 h-4 bg-[#232326]"
          />
          <Breadcrumb>
            <BreadcrumbList className="font-['Inter']">
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink 
                  href="/reader"
                  className="text-[#8b5cf6] hover:text-[#7c3aed] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111112] rounded-sm"
                >
                  {bookTitle}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block text-[#71717a]" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-black font-medium">{chapterMeta.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        
        <div className="flex flex-1 flex-col">
          {/* Main Content Area */}
          <div className="flex-1 p-8 bg-white">
            {/* MDX Content with proper typography */}
            <article className="max-w-[60ch] mx-auto">
              <div className="prose prose-lg prose-invert max-w-none">
                <style jsx>{`
                  .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
                    font-family: 'Inter', sans-serif;
                    font-weight: 700;
                    color: #fafaf9;
                    letter-spacing: -0.015em;
                  }
                  .prose p, .prose li, .prose blockquote {
                    font-family: 'Georgia', serif;
                    color: #fafaf9;
                    font-size: 1.1rem;
                    line-height: 1.6;
                  }
                  .prose blockquote {
                    border-left: 3px solid #71717a;
                    background-color: #18181b;
                    color: #a1a1aa;
                    font-style: italic;
                    padding-left: 1.4em;
                    margin: 1.5em 0;
                  }
                  .prose code {
                    font-family: 'Fira Mono', monospace;
                    color: #8b5cf6;
                    background-color: #232326;
                    padding: 0.2em 0.4em;
                    border-radius: 0.25rem;
                    font-size: 0.95em;
                  }
                  .prose pre {
                    background-color: #232326;
                    border: 1px solid #3f3f46;
                    border-radius: 0.5rem;
                  }
                  .prose strong {
                    color: #fafaf9;
                    font-weight: 700;
                  }
                  .prose a {
                    color: #8b5cf6;
                    font-weight: 600;
                    text-decoration: none;
                  }
                  .prose a:hover {
                    color: #7c3aed;
                    text-decoration: underline;
                  }
                `}</style>
                <MDXContent components={mdxComponents} />
              </div>
            </article>

            {/* Reflection Block with proper styling */}
            <div className="max-w-[60ch] mx-auto mt-12">
              <div className="bg-[#232326] border border-[#3f3f46] rounded-xl p-6">
                <ReflectionPromptBlock
                  prompt={`What stood out to you most in "${chapterMeta.title}"?`}
                  value={reflection}
                  onChange={setReflection}
                />
              </div>
            </div>

            {/* End-of-Chapter Actions with proper styling */}
            <div className="max-w-[60ch] mx-auto mt-8">
              <div className="bg-[#232326] border border-[#3f3f46] rounded-xl p-6">
                <EndOfChapterActions
                  onShareQuote={() => alert("Share")}
                  onDiscuss={() => alert("Discuss")}
                  onNextChapter={() => alert("Next")}
                />
              </div>
            </div>

            {/* Comment Thread with proper styling */}
            <div className="max-w-[60ch] mx-auto mt-8 mb-24">
              <div className="bg-[#232326] border border-[#3f3f46] rounded-xl p-6">
                <CommentThread initialComments={[]} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* Preserve all your existing modals and AI components */}
      <HighlightModal
        open={highlightModalOpen}
        onClose={() => setHighlightModalOpen(false)}
        highlightText={highlightText}
        onCopy={() => {
          navigator.clipboard.writeText(highlightText);
          setHighlightModalOpen(false);
        }}
        onShare={() => alert("Share")}
        onAskAI={() => alert("Ask AI")}
      />
      
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />

      {/* --- Floating Chatbot --- */}
      <FloatingChatbot onOpen={() => setChatOpen(true)} agent={selectedAgent} />
      
      {/* --- Full Chat Modal --- */}
      <ChatbotModal open={chatOpen} onClose={() => setChatOpen(false)} agent={selectedAgent} />
      
      {/* --- Bottom Agent Selector Bar --- */}
      <div className="fixed left-0 right-0 bottom-0 z-40 bg-[#232326] border-t border-[#3f3f46] px-4 py-2 flex flex-row justify-center items-center gap-2 overflow-x-auto">
        {AGENTS.map((agent) => (
          <button
            key={agent.id}
            onClick={() => setSelectedAgent(agent)}
            className={`
              flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all font-['Inter']
              ${selectedAgent.id === agent.id
                ? "bg-[#8b5cf6] text-black shadow-sm"
                : "text-[#a1a1aa] hover:text-black hover:bg-[#18181b]"
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#232326]
            `}
            style={{ minWidth: 64, minHeight: 60 }}
            aria-label={`Select ${agent.label} agent`}
          >
            <img
              src={agent.icon}
              alt={agent.label}
              className="w-6 h-6 object-contain mb-1"
            />
            <span className="text-xs font-medium leading-tight">{agent.label}</span>
          </button>
        ))}
      </div>
    </SidebarProvider>
  );
}