# Project Brief: Alan Hirsch Digital Reader & Publishing Platform

## Overview

You are an expert product designer, UX specialist, and prompt engineer collaborating to develop a next-generation digital book and learning platform for Alan Hirsch, a globally influential Christian author and thought leader. This project is both a flagship for Alan’s work (alanhirsch.org) and a prototype for a broader “New Book Platform” (NBP) model intended to serve other thought leaders, writers, and organizations in the future.

## Mission

**Transform the traditional static book into a living, interactive, AI-powered digital reading experience**—one that:
- Elevates longform reading and study
- Deepens engagement and learning
- Enables new direct-audience business models (subscriptions, community, membership, premium content)
- Demonstrates a sustainable, author-owned alternative to legacy publishing

## Strategic Goals

- **Build a beautiful, immersive digital reading experience** for Alan’s books, optimized for both web and future mobile app.
- **Layer in interactive and AI-powered features** that go far beyond a simple eBook/PDF.
- **Guide users from casual readers to engaged community members and supporters.**
- **Design for modularity, reusability, and white-labeling**—so this becomes a template for other leaders/networks.

## MVP Features (Alan Hirsch Reader)

1. **Core Reading Experience**
   - Premium typography, print-like spacing, accessible color and font choices
   - Responsive layout (sidebar navigation for desktop, mobile-friendly menus)
   - Table of Contents with progress tracking and “continue reading” resume
   - Search across book and notes

2. **Content Interactivity**
   - Expandable footnotes and callouts
   - Inline commentary and author/guest reflections
   - Embedded media: audio, video, images, diagrams
   - Reflection and engagement prompts (discussion, self-assessment, journaling)

3. **Reader Tools**
   - Highlighting and annotation (with or without login)
   - Personal reading progress (resume where you left off)
   - Shareable quotes (social, export, copy)
   - Comments and community Q&A (at the section/chapter level)
   - Direct feedback to author (and/or AI)

4. **AI/Smart Layer**
   - Persistent sidebar AI assistant (“Ask Alanbot”) aware of current context
   - Highlight-to-ask: user highlights text, gets instant summary/explanation/connection (AI-generated)
   - Dynamic recommendations: at end of chapter, suggest related content, deeper dives, or next steps

5. **User Engagement & Conversion**
   - Non-intrusive onboarding and feature discovery
   - Clear CTAs: Join newsletter, become supporting member, join discussion, buy print/other products
   - Optional accounts for saving highlights, notes, and progress

6. **Admin/Content Management**
   - Book and chapter content managed in MDX or similar for easy updating
   - Authoring pipeline that enables Alan and team to add commentary/media/AI prompts without code

7. **Analytics & Data**
   - Track reading behavior, highlights, AI engagement, conversions on key CTAs

## UX/UI Design Benchmarks

- **Take inspiration from:**
  - [Readwise Reader](https://read.readwise.io/) (for overall reading experience, highlights, notes, AI)
  - [Medium](https://medium.com/) (for comments, highlights, and shareable quotes)
  - [Notion](https://www.notion.so/guides/add-content) (for embedded media and block-based content)
  - [Substack](https://thebrowser.review/) (for community and email capture)
- **Key patterns:** Persistent sidebars, progressive disclosure, modal/popover interactions, contextual CTAs

## Technology Stack

- **Frontend:** React (Next.js), TailwindCSS, ShadCN UI, Aceternity UI
- **Backend/Content:** MDX or compatible CMS (for now)
- **AI Integration:** GPT-4/4o API or similar for contextual assistant/chat
- **App future:** Designed for PWA and mobile app via Capacitor

## Component Tree Reference

See below for the target component hierarchy and architecture to guide the initial build. Components should be modular, strongly typed (TypeScript), and designed for extensibility.

```plaintext
AppLayout
│
├── SidebarNavigation
│   ├── SidebarHeader
│   ├── TOCList
│   ├── NavShortcutList
│   └── UserProfileMini
│
├── MainContentArea
│   ├── TopBar
│   │   ├── BackButton
│   │   ├── Breadcrumbs
│   │   ├── ThemeSwitcher
│   │   ├── FontSizeSelector
│   │   └── SearchInput
│   │
│   ├── BookHeader
│   │   ├── BookTitle
│   │   ├── AuthorInfo
│   │   ├── Metadata (reading time, published date)
│   │   └── ListenButton (audio, TTS)
│   │
│   ├── ChapterContent
│   │   ├── Paragraph
│   │   │   └── HighlightableText
│   │   │       ├── HighlightToolbar (popover: add note, copy, share, ask AI)
│   │   │       └── InlineFootnoteReference
│   │   │           └── FootnotePopover
│   │   ├── ImageEmbed
│   │   ├── AudioEmbed
│   │   ├── VideoEmbed
│   │   ├── DiagramEmbed
│   │   ├── CalloutBlock (for commentary, tips, warnings)
│   │   ├── ReflectionPromptBlock
│   │   └── EndOfChapterActions
│   │        ├── ShareQuoteButton
│   │        ├── DiscussSectionButton
│   │        └── NextChapterButton
│   │
│   ├── CommentThread
│   │   ├── CommentList
│   │   └── AddCommentBox
│   │
│   └── ProgressIndicatorBar
│
├── RightSidebar
│   ├── InfoPanel
│   │   ├── SummaryBox
│   │   ├── MetadataBox
│   │   └── NotebookTab (user notes/highlights)
│   │
│   ├── AIChatSidebar
│   │   ├── AIChatHeader
│   │   ├── AIChatMessages
│   │   └── AIChatInput
│   │
│   └── ActionsPanel (Save, Bookmark, etc.)
│
├── MobileDrawerNavigation
│   ├── TOCListMobile
│   ├── NavShortcutListMobile
│   └── SettingsPanelMobile
│
├── GlobalModals
│   ├── HighlightActionsModal (add note, share, AI prompt)
│   ├── FootnoteModal (for mobile)
│   ├── LoginModal
│   └── OnboardingTooltipSequence
│
└── AnalyticsTracker