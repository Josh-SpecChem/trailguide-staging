## 🏗️ Alan Hirsch Reader App — Component Build Order

### 1. Global Layout & Theme
- `AppLayout` (or `ReaderLayout`)
- `ThemeProvider`, global CSS, font imports

### 2. Navigation & Structure
- `SidebarNavigation`
  - `SidebarHeader`
  - `TOCList`
  - `NavShortcutList`
  - `UserProfileMini`
- `TopBar`
  - `BackButton`
  - `Breadcrumbs`
  - `ThemeSwitcher`
  - `FontSizeSelector`
  - `SearchInput`

### 3. Main Content Area
- `BookHeader`
  - `BookTitle`
  - `AuthorInfo`
  - `Metadata` (reading time, published date)
  - `ListenButton` (audio, TTS)
- `ProgressIndicatorBar`

### 4. Chapter/Page Display
- `ChapterContent`
  - `Paragraph`
    - `HighlightableText`
      - `HighlightToolbar` (popover: add note, copy, share, ask AI)
      - `InlineFootnoteReference`
        - `FootnotePopover`

### 5. Footnotes & Callouts
- `InlineFootnoteReference` + `FootnotePopover`
- `CalloutBlock` (commentary, tips, warnings)

### 6. Media Embeds
- `ImageEmbed`
- `AudioEmbed`
- `VideoEmbed`
- `DiagramEmbed`

### 7. Reflection/Engagement
- `ReflectionPromptBlock`
- `EndOfChapterActions`
  - `ShareQuoteButton`
  - `DiscussSectionButton`
  - `NextChapterButton`

### 8. Reader Tools
- `HighlightToolbar` (popover for highlighted text)
- `CommentThread`
  - `CommentList`
  - `AddCommentBox`

### 9. AI Features
- `AIChatSidebar`
  - `AIChatHeader`
  - `AIChatMessages`
  - `AIChatInput`
- Highlight-to-Ask-AI integration (tied to `HighlightToolbar`)

### 10. RightSidebar / Info Panels
- `InfoPanel`
  - `SummaryBox`
  - `MetadataBox`
  - `NotebookTab` (user notes/highlights)
- `ActionsPanel` (Save, Bookmark, etc.)

### 11. Mobile/Drawer Navigation
- `MobileDrawerNavigation`
  - `TOCListMobile`
  - `NavShortcutListMobile`
  - `SettingsPanelMobile`

### 12. Modals & Global Utilities
- `HighlightActionsModal`
- `FootnoteModal` (for mobile)
- `LoginModal`
- `OnboardingTooltipSequence`

### 13. Analytics & Tracking
- `AnalyticsTracker`