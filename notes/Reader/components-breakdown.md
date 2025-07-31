# Alan Hirsch Reader: Component Documentation & UX Ingredient Map

> **Note:**  
> All files listed below exist at custom paths, not always at `/components/ui/`.  
> See actual file locations in each entry.

---

## Table of Contents

1. [Main Content Area](#main-content-area)
2. [Chapter/Page Display](#chapterpage-display)
3. [Footnotes & Callouts](#footnotes--callouts)
4. [Media Embeds](#media-embeds)
5. [Reflection & End-of-Chapter](#reflection--end-of-chapter)
6. [Reader Tools](#reader-tools)
7. [AI & Right Sidebar](#ai--right-sidebar)
8. [Mobile Drawer Navigation](#mobile-drawer-navigation)
9. [Global Modals & Utilities](#global-modals--utilities)

---

## Main Content Area

**Components:**
- `/components/readwise/book-header.tsx`
- `/components/ui/progress-indicator-bar.tsx`

**Key Ingredients:**
- **Card:** Used for containing and styling the Book Header section (optionally).
- **Typography:** Uses ShadCN-style headings, author info, metadata.
- **Button:** ListenButton uses ShadCN's Button for TTS/audio.
- **Progress:** `ProgressIndicatorBar` uses ShadCN's Progress UI.
- **Flex & Layout:** Responsive flex layouts via Tailwind.

---

## Chapter/Page Display

**Components:**
- `/components/readwise/chapter-content.tsx`
- `/components/ui/paragraph.tsx`
- `/components/ui/highlightable-text.tsx`
- `/components/ui/highlight-toolbar.tsx`
- `/components/ui/footnote-popover.tsx`

**Key Ingredients:**
- **Highlightable Text:** Selection triggers a **Popover** with highlight actions.
- **HighlightToolbar:** ShadCN Popover, Button, and icon buttons (note, copy, share, AI).
- **FootnotePopover:** Inline footnote ref opens a **Popover** for note content.
- **Typography:** Prose/paragraph style.
- **Utility functions:** For rendering inline footnotes in text.

---

## Footnotes & Callouts

**Components:**
- `/components/ui/inline-footnote-reference.tsx`
- `/components/ui/callout-block.tsx`

**Key Ingredients:**
- **Popover:** Used for showing footnote contents.
- **Alert/Card:** `CalloutBlock` uses ShadCN Alert (can easily swap to Card).
- **Icons:** Lucide icons by variant (Info, Lightbulb, AlertTriangle, etc.).
- **Typography:** Title/description styling per callout type.

---

## Media Embeds

**Components:**
- `/components/ui/image-embed.tsx`
- `/components/ui/audio-embed.tsx`
- `/components/ui/video-embed.tsx`
- `/components/ui/diagram-embed.tsx`

**Key Ingredients:**
- **Card:** Used as a wrapper for each media embed for consistent border, padding, shadow.
- **Dialog:** `ImageEmbed` can use ShadCN Dialog for zoom modal.
- **Audio/Video Elements:** Native players styled with Tailwind/utility.
- **AspectRatio:** (if used) for video consistency.
- **Icons:** Lucide for "zoom," "audio," "video," etc.
- **Figure/Figcaption:** Semantic HTML for captions.

---

## Reflection & End-of-Chapter

**Components:**
- `/components/ui/reflection-prompt-block.tsx`
- `/components/ui/end-of-chapter-actions.tsx`

**Key Ingredients:**
- **Card:** Used for both prompt and actions container.
- **Textarea:** ShadCN Textarea for reflection input.
- **Button:** ShadCN Buttons with Lucide icons for share, discuss, next chapter.
- **Flex Layout:** Responsive flex for actions.

---

## Reader Tools

**Components:**
- `/components/ui/highlight-toolbar.tsx`
- `/components/ui/comment-thread.tsx`
- `/components/ui/comment-list.tsx`
- `/components/ui/add-comment-box.tsx`

**Key Ingredients:**
- **Popover:** For highlight toolbar.
- **Card:** For comment thread container.
- **Textarea:** For comment input.
- **Button:** For comment submission.
- **Avatar:** ShadCN Avatars for users in comments.
- **Icons:** Lucide for actions, avatars, etc.
- **Flex & List:** Tailwind flex, column gap for comment layout.

---

## AI & Right Sidebar

**Components:**
- `/components/ui/ai-chat-sidebar.tsx`
- `/components/ui/info-panel.tsx`
- `/components/ui/actions-panel.tsx`
- `/components/readwise/right-sidebar.tsx`

**Key Ingredients:**
- **Card:** Each panel (AI chat, InfoPanel, ActionsPanel) uses Card.
- **Tabs:** ShadCN Tabs for InfoPanel (Summary, Metadata, Notebook).
- **Input:** For AIChatInput.
- **Button:** Send, Save, Bookmark, Favorite.
- **Icons:** Lucide Bot, Notebook, Bookmark, etc.
- **ScrollArea:** For chat message scrolling.
- **Sidebar Layout:** Used as a sticky right sidebar container.

**Highlight-to-Ask-AI Integration:**  
- **HighlightToolbar:** Calls AIChatSidebar (context/state, prefilled).

---

## Mobile Drawer Navigation

**Components:**
- `/components/ui/mobile-drawer-navigation.tsx`

**Key Ingredients:**
- **Drawer:** ShadCN Drawer for mobile nav.
- **Button:** For menu trigger.
- **List:** Tailwind flex/column for TOC, shortcuts, settings.
- **Icons:** Lucide Menu, BookOpen, Home, Settings.
- **Nav Panel:** Modular sections for chapters, shortcuts, settings.

---

## Global Modals & Utilities

**Components:**
- `/components/ui/highlight-actions-modal.tsx`
- `/components/ui/footnote-modal.tsx`
- `/components/ui/login-modal.tsx`
- `/components/ui/onboarding-tooltip-sequence.tsx`

**Key Ingredients:**
- **Dialog:** ShadCN Dialog for all modals (highlight, footnote, login).
- **Popover:** For onboarding tooltip sequence (multi-step).
- **Input:** For login email/password.
- **Button:** For modal actions, tooltip steps.
- **Icons:** Lucide as relevant for actions.

---

# Modular UX Ingredient Map

When updating or customizing the UX, these are your key reusable patterns:

- **Card:** Used almost everywhere for content sections, panels, callouts, embeds, reflection.
- **Popover:** Used for tooltips, highlight actions, footnotes, onboarding.
- **Dialog:** Used for modals—highlight, footnote (mobile), login, etc.
- **Tabs:** InfoPanel in sidebar uses Tabs for switching views.
- **Textarea/Input:** Reflection, comment, AI chat, login—all use ShadCN inputs.
- **Button:** Every action, CTAs, toolbar.
- **Avatar:** Comment threads.
- **Alert:** For callout blocks (swap for Card if desired).
- **ScrollArea:** For AI chat.
- **Drawer:** For mobile nav.
- **Typography:** Consistent, Tailwind+ShadCN-based headings, text, figcaption.

**Pro Tip:**  
If you want to update the look/behavior of a "Card" or "Popover" everywhere, update the component in `/components/ui/` and all usages will inherit your changes.  
Each higher-level Reader component is composed of these modular ingredients.

---

# Quick Reference: Your Custom File Locations