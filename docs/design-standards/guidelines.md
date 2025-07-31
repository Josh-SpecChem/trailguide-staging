Guiding Principles
	•	Simplicity, clarity, contrast. Our design is dark, modern, legible, and technical—but never cold.
	•	Brand restraint. Accent color (purple) is only for actionable elements and key highlights. Everything else is grayscale.
	•	Consistency over cleverness. If in doubt: follow the system, not your whims.
	•	Field-first UX. Interfaces should work fast and clearly in real jobsite and business contexts, not just look good in Figma.
	•	Accessible by default. Color, size, spacing, and focus styles always meet or exceed accessibility minimums.

⸻

1. Color System

Palette
	•	background: #111112 – App/page base
	•	foreground: #fff – Main text
	•	surface/surface2: #232326 / #18181b – Cards, panels, elevated elements
	•	gray.50–950: Locked grayscale ramp for non-interactive UI
	•	accent: #8b5cf6 (violet-500) – For interactive only: links, buttons, toggles, focus, active icons
	•	accentHover: #7c3aed – Only for accent element hover/active states

Code backgrounds: Use #232326 for code, #18181b for inline

What this means in practice:
	•	NO color outside grayscale and accent.
	•	Accent only means actionable: Never use purple for borders, backgrounds, or “decorative” elements.
	•	Cards, tables, modals = surface colors. No gradients, no “fun” color splashes.
	•	Charts: Only use defined chart colors, and always provide a grayscale alternative.

⸻

2. Typography
	•	Headings (h1–h4): Inter, bold, all white, generous spacing, no drop shadows, strong contrast on dark bg.
	•	Body/reading: Georgia (serif), white on dark, comfortable line-height, max width 60ch.
	•	Code: Fira Mono, purple text for code (never red/green/yellow for syntax in main UI).
	•	Font size: Ranges from 0.95rem (xs) up to 3rem (4xl). Use base for most content.
	•	Emphasis: Use strong or mark for highlighting—never change text color outside palette.
	•	Blockquotes: Italic, muted fg (gray.200), surface bg (gray.900), left border. Never used for “pull quote” drama.

Rules of thumb:
	•	Only headings (and nav/CTAs) should ever use Inter.
	•	Do not use more than 2 font weights in a single component.
	•	Do not use uppercase for body text. Use case as written.

⸻

3. Layout & Spacing
	•	Grid: Use Tailwind grid or flex. Prefer 12-col for main content, 1–2col for sidebars.
	•	Max width: 60ch for prose. Cards/modals no wider than 700px.
	•	Padding: Cards: p-6 or p-8. Modals: p-8. Buttons: py-2 px-6 minimum.
	•	Breakpoints: Prioritize mobile (column stack), then desktop (side-by-side).

Do:
	•	Use generous whitespace. Let elements breathe.
	•	Always use gap-x/gap-y utilities over margin hacks.
	•	Collapse vertical spacing on mobile for critical actions.

Don’t:
	•	Never put content edge-to-edge unless it’s a hero/feature section.
	•	Never mix px/rem/em units within a block—pick one per component.

⸻

4. Buttons & Interactive Elements
	•	Primary button: .btn, .btn-primary — accent background, white text, bold, medium radius.
	•	Secondary/ghost: .btn-outline — transparent bg, accent border on hover, accent text only on hover/focus.
	•	Icon buttons: Accent color for action (edit, add, etc.), muted gray for default.
	•	States: Always show visible hover and focus, with accent and accentHover. Focus outlines must use accent, not browser default.

Do:
	•	Only use accent for interactive elements (NEVER for non-interactive).
	•	Use full width buttons (w-full) for critical actions on mobile.
	•	Always include aria-label and visible focus style on all buttons.

Don’t:
	•	Never use accent as a background or border color for static content.
	•	Never use more than one accent button per view (exception: table row actions).

⸻

5. Forms & Inputs
	•	Inputs: Background = background, border = border, focus = accent border + subtle ring.
	•	Labels: Always above field, left aligned, sm font.
	•	Checkboxes/radios: Use shadcn/ui’s accessible components.
	•	Validation: Use only red or accent for error state, never “warning yellow.”

Best practices:
	•	Group related fields in surface-colored cards or panels.
	•	Error and helper text always sm font, gray.400 or accent.
	•	Never place two fields side by side on mobile.

⸻

6. Cards, Modals, Surfaces
	•	Surface: #232326 or #18181b, subtle shadow (shadow-lg), 2xl radius.
	•	Borders: Use only defined border color (#232326). Never use accent.
	•	Shadow: Only for cards, popovers, dropdowns—never on base layout.
	•	Elevation: Indicate with shadow, not color.

⸻

7. Tables & Data
	•	Table header: bold, white, surface bg.
	•	Table row: alternate with surface2 bg for readability.
	•	Selected/active: accent border on left, not full row color.

Accessibility:
	•	Always use aria-label and table headings.
	•	No color-only state changes—combine color with icon or font-weight for status.

⸻

8. Icons
	•	Action icons: Use accent for interactive, muted for inactive.
	•	Never use emoji or non-vector icons in UI.
	•	Use consistent icon library (e.g., Lucide) via shadcn/ui.

⸻

9. Contrast, Accessibility & Brand
	•	Always AAA contrast for text over bg.
	•	No light text on light bg, no dark text on dark bg.
	•	Focus styles: Always visible, always accent. No “browser blue ring.”
	•	Brand: Only use accent (purple) for action or highlight. No random color pops.
	•	Never: Use red/green for “success” or “error”—use accent for active, only muted red for destructive (e.g. “Delete”).

⸻

10. ShadCN & Aceternity UI Patterns

ShadCN
	•	Use shadcn/ui for forms, modals, dropdowns, tabs, toasts. All should be themed using your palette.
	•	Prefer variant="ghost" or variant="outline" for secondary actions.
	•	For dialog/modal, always use 2xl radius and max width as above.
	•	Toasts: Use surface2 bg, accent border for “success,” muted for “info.”

Aceternity UI
	•	Use Aceternity UI for advanced motion (spotlights, command palettes, scroll areas).
	•	Motion: Never overdo—1–2 motion elements per view max.
	•	Use spotlight or command bar for search/quick nav only.
	•	Use scroll areas for overflow content within modals or data-heavy blocks. Never for main page scroll.

General Patterns
	•	If it’s a native HTML element: Use Tailwind and your palette only.
	•	If it’s an advanced/complex element: Use shadcn for structure, aceternity for interactivity.
	•	Always wrap with a11y props and alt text where relevant.

⸻

11. Contrast Do’s & Don’ts

Do:
	•	Ensure all text has minimum contrast ratio 4.5:1 (AA), aim for 7:1 (AAA) wherever possible.
	•	Use accent on dark background for all actionable states.
	•	Use surface2 on surface for subtle elevation, never color.

Don’t:
	•	Never put accent text on accent background.
	•	Never use accent on anything static, or as background for cards/panels.
	•	Never use low-opacity white text for secondary information; instead, use gray.400/gray.500.

13. What to Avoid
	•	No playful/novelty colors, gradients, shadows.
	•	No accent backgrounds or cards.
	•	No colored borders except accent for focus/active.
	•	No more than 2 fonts per view.
	•	No font size under 0.95rem for any UI (excluding code/label).
	•	No ghost buttons for primary actions.
	•	No over-the-top motion.
	•	Never leave elements unthemed or “browser default.”

⸻

14. Special Cases
	•	Mobile nav: Always fixed bottom or top, never floating.
	•	Loading states: Use skeleton loaders or subtle shimmer, never spinners.
	•	Empty states: Use muted surface, icon in accent, clear call to action.

⸻

Summary:

Your site/app is dark, technical, sharp, and legible.
Accent purple means “DO SOMETHING”—nothing else.
Surface colors for everything else.
Typography and spacing are generous and considered.
ShadCN and Aceternity give you polish and motion, but never distract.
Accessibility is a feature, not an afterthought.