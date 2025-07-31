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