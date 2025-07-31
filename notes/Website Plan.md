✅ AlanHirsch.org — Full Website Plan (Markdown Work Order Format)

⸻

🏠 Home Page

Vision

The homepage should feel like arriving at a threshold—intimate, invitational, movement-oriented. Not a “ministry splash page,” but a compass for curious leaders. Less “Alan Hirsch, the brand” and more “The movement, the map, the mission.”

Tone: Warm. Rooted. Prophetic.
Visuals: Earth tones, trail-inspired iconography, subtle motion.
Content Structure:
	1.	Hero Section
“Reactivating the Church as Movement”
CTA buttons:
	•	“Explore the Frameworks”
	•	“Talk to the AlanBot”
	2.	Mini-Intro / Positioning Block
	•	Alan’s short intro + missional DNA statement (1–2 sentences)
	•	Optional: 60-second video reel (Alan voiceover or talk snippet)
	3.	Frameworks Preview
	•	APEST
	•	mDNA
	•	Liminality & Communitas
	•	Movement Thinking
	4.	Featured Content Feed
Pulls from the Writing or Archive section
	5.	Newsletter Invite
“Letters from the Edge of the Church”
	6.	AlanBot Teaser
Prompt: “Ask Alan how to launch a microchurch…” → auto-suggests top queries
	7.	Footer
Includes navigation, social, movement network shoutout

⸻

Elements to Build
	•	<HeroBanner /> (headline, subhead, CTA buttons)
	•	<IntroBlock /> (image + narrative)
	•	<FrameworksPreview /> (cards or vertical trail nav)
	•	<ContentFeed /> (pulls 3–5 most recent posts)
	•	<NewsletterSignup /> (email input + Firebase integration)
	•	<AlanBotWidgetPreview /> (search field, mock question)
	•	<Footer />

⸻

📚 Frameworks Page

Vision

This is the heart of Alan’s intellectual and spiritual contribution—a living field guide to his core frameworks, each one presented like a trailhead.

Each framework should feel like its own section: interactive, layered, and explorable.

Intro Copy:
“You don’t need a new model. You need new imagination. Start here.”

Frameworks to Feature:
	•	APEST Intelligence
	•	The Forgotten Ways / mDNA
	•	Liminality & Communitas
	•	Christology → Missiology → Ecclesiology
	•	Movement vs. Institution

Each framework gets:
	•	Visual model (SVG or animated if possible)
	•	Short essay (300–500 words)
	•	Downloadable tool / worksheet
	•	Optional podcast / Audio Overview

⸻

Elements to Build
	•	<FrameworkIndex /> (cards or vertical nav per framework)
	•	<FrameworkDetailPage /> template (used per framework)
	•	<ModelIllustration /> (Midjourney SVG or hand-drawn assets)
	•	<DownloadLink />
	•	<AudioOverview /> (integrated with NotebookLM audio or podcast)

⸻

🤖 AlanBot Page

Vision

This is the conversational layer of the site. A GPT assistant trained on Alan’s corpus and voice. The UI should evoke a thoughtful, calm dialogue space.

Prompt Suggestions:
	•	“What does APEST look like in a house church?”
	•	“How do I lead from the margins?”
	•	“What does it mean to activate communitas?”

⸻

Elements to Build
	•	<AlanBotChat /> (OpenAI Assistant UI wrapper)
	•	<PromptSuggestions /> (click-to-load examples)
	•	<BotSidebar /> (usage instructions + Alan’s framing)
	•	<BotPersonaCard /> (Alan’s assistant bio + disclaimer)

⸻

🧠 Archive Page

Vision

A fully searchable, filterable Alan Hirsch Archive — his life’s work, beautifully organized. This is a gift to the church and future movement leaders.

Search Parameters:
	•	Type: Books, Essays, Talks, Videos, PDFs, Podcasts
	•	Theme: APEST, Church as Movement, Discipleship, etc.
	•	Format: Audio, Video, Text
	•	Date or relevance sort

Each result includes:
	•	Title
	•	1-sentence summary
	•	Tags
	•	Media link or download

⸻

Elements to Build
	•	<ArchiveSearch /> (search bar with filtering UI)
	•	<ArchiveFilters />
	•	<ArchiveItemCard /> (type, tag, link)
	•	<ArchiveDetailPage /> (full entry view with media embedding)
	•	Firebase + vector search index
	•	Optional: Admin upload dashboard

⸻

✍️ Writing Page (Blog / Essays / Letters)

Vision

Alan’s public notebook. This is where new ideas live before they’re frameworks or books. Should feel approachable and prophetic.

Categories:
	•	Essays
	•	Field Notes
	•	Book Excerpts
	•	“Letters from the Edge” (his Substack-style reflections)

⸻

Elements to Build
	•	<WritingFeed /> (blog roll)
	•	<WritingPost /> (rich markdown, quote styling)
	•	<WritingTags />
	•	<NewsletterCTABanner />
	•	CMS hook for posting/editing via Firebase

⸻

🧰 Tools & Resources Page

Vision

Practical resources and downloads for use in teams, house churches, cohorts. This could grow into a full Movement Toolkit Library over time.

Types of Tools:
	•	Worksheets (e.g. “APEST Audit for Your Team”)
	•	Slide decks
	•	Printable diagrams
	•	Audio clips
	•	Templates for gatherings

⸻

Elements to Build
	•	<ResourceLibrary /> (grid or list UI)
	•	<DownloadableCard /> (title + preview + download button)
	•	<ToolkitCategories />
	•	Optional <ResourceDetail /> view with context

⸻

🧑‍🏫 Learning Page

Vision

Eventually this becomes a full-fledged learning platform. For now, it’s a page linking to:
	•	Courses (free or paid)
	•	Live or digital cohorts
	•	Upcoming speaking or intensives

Tone: Practical and invitational.

⸻

Elements to Build
	•	<LearningOfferings /> (cards or sections for each option)
	•	<EventCard /> (w/ date, topic, registration link)
	•	<CoursePromo /> (Alan’s video + syllabus)
	•	<WaitlistForm />

⸻

👤 About + Invitation Page

Vision

A deeply personal “Why Alan?” page—but oriented around inviting people into the story, not showing off credentials.

Should include:
	•	Alan’s story
	•	Timeline of books / frameworks
	•	What he’s saying yes/no to in this season
	•	Link to request speaking, collaboration, or coaching

⸻

Elements to Build
	•	<BioNarrative /> (photo + narrative prose)
	•	<TimelineOfWork /> (chronological visual)
	•	<InvitationCard /> (CTAs for events or collab)
	•	<ContactForm /> (simple Firebase email form)

⸻

🔚 Footer (Global Component)
	•	Site nav (Frameworks, Archive, Writing, etc.)
	•	Social links (Twitter, YouTube, etc.)
	•	Newsletter signup
	•	Movement partner shoutout

⸻

🧱 Other Global Elements
	•	Responsive Nav (<Navbar />)
	•	Mobile menu
	•	Global layout wrapper with theme toggling (dark mode?)
	•	SEO metadata component
	•	404 page with redirect to Archive or Writing
	•	Firebase Auth (optional, for CMS-only access)